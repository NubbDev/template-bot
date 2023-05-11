import { ApplicationCommand, ApplicationCommandType, ChatInputCommandInteraction } from "discord.js";
import { CommandType } from '../../../types';

export default {
    name: 'ping',
    description: 'responds with pong!',
    type: ApplicationCommandType.ChatInput,
    run(client, interaction: ChatInputCommandInteraction) {
        interaction.reply(
            `🏓 Pong! Latency of ${interaction.createdTimestamp - Date.now()}ms. API Latency of ${client.bot.ws.ping}ms`
        )
    },
} as CommandType