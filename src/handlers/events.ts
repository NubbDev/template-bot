import { ClientType, EventType } from "../types"
import dotenv from "dotenv";
import path from 'path'
import fs from 'fs'
import { AlignmentEnum, AsciiTable3 } from "ascii-table3";
import { endsWithAny } from "../utils";

export default (client: ClientType) => {
    const table = new AsciiTable3('Events')
        .setHeading('Name', 'Status')
        .setHeadingAlign(AlignmentEnum.CENTER)
        .setAlignCenter(3)
        .setStyle('unicode-single')
    Promise.allSettled([
        new Promise((resolve) => {
            const dir = path.join(__dirname, '..', 'events')
            fs.readdirSync(dir).filter(file => endsWithAny(['.ts', '.js'], file)).forEach(file => {
                const filepath = path.join(dir, file)
                import(filepath).then(x => {
                    const event = x.default as EventType
                    event.run(client)
                    table.addRow(event.name, 'Loaded')
                })
            })
            resolve(true)
        })
        
    ]).then(() => {
        console.log(table.toString())
    })
}