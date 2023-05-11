import { Events } from "discord.js";
import { EventType } from "../types";

export default {
    name: "Ready",
    run(client) {
        client.bot.on(Events.ClientReady, () => {
            
        })
    },
} as EventType