import { EventType } from "../types";

export default {
    name: "Interaction Create",
    run: (client) => {
        client.bot.on('interactionCreate', async interaction => {  
            if (interaction.isChatInputCommand()) {
                const command = client.slashcommands.get(interaction.commandName);
                if (!command) {
                    client.slashcommands.delete(interaction.commandName)
                    interaction.reply({
                        content: `Command ${interaction.commandName} not found`,
                        ephemeral: true
                    })
                    return
                };

                try {
                    await command.run(client, interaction);
                } catch (e) {
                    console.error(e);
                }
            } else if (interaction.isAutocomplete()) {
                const command = client.slashcommands?.get(interaction.commandName);

                if (!command) {
                    console.error(`Command ${interaction.commandName} not found`)
                    return;
                }
                try {
                    await command.autocomplete!(client, interaction);
                } catch (e) {
                    console.error(e);
                }
            }
        })
    }
} as EventType;