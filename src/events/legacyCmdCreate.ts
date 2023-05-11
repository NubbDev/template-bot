import { EventType } from "../types";

export default {
    name: "Legacy Command Handler",
    run(client) {
        client.bot.on('messageCreate', async message => {
            if (message.author.bot) return;
            if (!message.content.startsWith(client.config.prefix)) return;
            const args = message.content.toLocaleLowerCase().slice(client.config.prefix.length).trim().split(/ +/g);
            const command = client.commands.get(args[0]);

            if (!command) {
                client.commands.delete(args[0])
                return
            }

            try {
                await command.run(client, message, args);
            } catch (e) {
                console.error(e);
            }
        })
    },
} as EventType;