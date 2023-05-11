import { ApplicationCommandType, ChatInputCommandInteraction, blockQuote, codeBlock, userMention } from "discord.js";
import { CommandType } from "../../../types";

export default {
    name: "reload",
    description: "Reloads all commands and events",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "command",
            description: "Reloads a command",
            type: 3,
            required: true,
        }
    ],
    async run(client, interaction: ChatInputCommandInteraction) {
        if (!client.config.owners.includes(interaction.user.id)) {
            return interaction.reply({
                content: `Only the **Bot Owner**, ${userMention("401844809385508903")}, can use this command!`,
                ephemeral: true
            })
        }

        const name = interaction.options.getString('command') as string;
        
        const command = client.slashcommands.get(name)

        if (!command) {
            return interaction.reply({
                content: `Command \`${name}\` not found!`,
                ephemeral: true
            })
        }

        const path = client.paths.slashcommands.get(command.name) as string
        
        delete require.cache[require.resolve(path)]
        try {
            client.slashcommands.delete(command.name)
    
            const newCommand = (await import(path)).default as CommandType
    
            client.slashcommands.set(newCommand.name, newCommand)
            
            interaction.reply({
                content: `Command \`${name}\` was reloaded!`,
                ephemeral: true
            })
        }
        catch (error: any) {
            console.error(error)
            
            interaction.reply({
                content: `There was an error while reloading a command \`${name}\`:\n ${codeBlock(error.message)}}`,
                ephemeral: true
            })
        }
    }
} as CommandType