import { ChannelType } from "discord.js";
import { EventType } from "../types";

export default {
    name: "Legacy Command Handler",
    run(client) {
        client.bot.on('messageCreate', async message => {
            if (message.author.bot) return;
            if (!message.content.startsWith(client.config.prefix)) return;
            const args = message.content.toLocaleLowerCase().slice(client.config.prefix.length).trim().split(/ +/g);
            const cmd = args.shift()?.toLowerCase();
            if (!cmd) return;
            const command = client.commands.get(cmd);

            if (!command) {
                client.commands.delete(args[0])
                return
            }

            args.shift();

            try {
                await command.run(client, message, args);
            } catch (e) {
                console.error(e);
            }
        })
    },
} as EventType;