import { CommandType } from "../../../types";

export default {
    name: "ping",
    description: "Pong!",

    run: async (client, message, args) => {
        message.reply({
            content: `🏓 Pong! Latency of ${message.createdTimestamp - Date.now()}ms. API Latency of ${client.bot.ws.ping}ms`
        })
    }
} as CommandType;