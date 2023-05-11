import { REST } from "discord.js";
import { Routes } from "discord-api-types/v10";
import { ClientType, CommandType } from "../types";
import dotenv from "dotenv";
import path from 'path'
import fs from 'fs'
import {AlignmentEnum, AsciiTable3} from 'ascii-table3'
import { endsWithAny } from "../utils";

dotenv.config();

export default (client: ClientType) => {
    const slashTable = new AsciiTable3('Slash Commands')
        .setHeading('Name', 'Status')
        .setHeadingAlign(AlignmentEnum.CENTER)
        .setAlignCenter(3)
        .setStyle('unicode-single')

    const cmdTable = new AsciiTable3('Legacy Commands')
        .setHeading('Name', 'Status')
        .setHeadingAlign(AlignmentEnum.CENTER)
        .setAlignCenter(3)
        .setStyle('unicode-single')
    Promise.allSettled([
        new Promise(async (resolve) => {
            const dir = path.join(__dirname, '../commands/slash')
            getCommands(dir, client.slashcommands, client.paths.slashcommands, slashTable).then(() => resolve(true))
        }),
        new Promise(async (resolve) => {
            const dir = path.join(__dirname, '../commands/legacy')
            getCommands(dir, client.commands, client.paths.commands, cmdTable).then(() => resolve(true))
        }),
        
    ]).then(() => {
        registerCommands(Array.from(client.slashcommands.values()))
        console.log(slashTable.toString())
        console.log(cmdTable.toString())
    })
}

const registerCommands = async (commands: Array<CommandType>) => {
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN as string);

    try {
        if (process.env.NODE_ENV?.toLocaleLowerCase() === 'dev') {
            console.log('Development mode detected, registering commands to guild');
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENTID as string, process.env.GUILDID as string),
                { body: commands}
            )
        } else {
            await rest.put(
                Routes.applicationCommands(process.env.CLIENTID as string),
                { body: commands}
            )
        }
    } catch (e) {
        console.error(e)
    }
};

const getCommands = async (dir: string, list: Map<string, CommandType>, cache:Map<string, string>, table: AsciiTable3) => {
    fs.readdirSync(dir).forEach(childDir => {
        const cmdFiles = fs.readdirSync(`${dir}/${childDir}`).filter(file => endsWithAny(['.ts', '.js'], file))
        cmdFiles.forEach(file => {
            const filepath = path.join(dir, childDir, file)
            import(filepath).then(x => {
                const command = x.default as CommandType
                list.set(command.name, command)
                cache.set(command.name, path.join(dir, childDir, file))
                table.addRow(command.name, 'Loaded')
            })
        })
    })
}