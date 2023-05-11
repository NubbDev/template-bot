import { Events } from "discord.js";
import { EventType } from "../types";

export default {
    name: "Logging",
    run(client) {
        client.bot.on(Events.Debug, m => client.logger.debug(m))
        client.bot.on(Events.Warn, m => client.logger.warn(m))
        client.bot.on(Events.Error, m => client.logger.error(m))
    },
} as EventType