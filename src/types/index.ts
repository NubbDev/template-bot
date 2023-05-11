import { ApplicationCommandType, AutocompleteInteraction, ChatInputCommandInteraction, Client, Message, PermissionResolvable } from "discord.js";
import { Logger } from 'pino'

export interface ClientType {
    bot: Client,
    logger: Logger<any>,
    commands: Map<string, CommandType>,
    slashcommands: Map<string, CommandType>,
    events: Map<string, EventType>
    config: {
        prefix: string,
        owners: string[],
        devGuild: string
    },
    paths: {
        commands: Map<string, string>
        slashcommands: Map<string, string>
    }
}

export interface CommandType {
    name: string;
    description: string;
    type?: ApplicationCommandType | null;
    options?: Array<CommandOption> | null;
    default_permission?: PermissionResolvable | null;
    default_member_permissions?: PermissionResolvable | null | undefined;
    autocomplete?(client: ClientType, interaction: AutocompleteInteraction): Promise<void>;
    run (client: ClientType, interaction: ChatInputCommandInteraction): Promise<void>;
    run (client: ClientType, message: Message, args: string[]): Promise<void>;
}
export interface EventType {
    name: string;
    description: string;
    run: (client: ClientType) => void;
}
export interface CommandOption {
    name: string;
    description: string;
    type: number;
    options?: Array<CommandOption>
    required?: boolean;
    autocomplete?: boolean;
}