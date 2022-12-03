import { SlashCommandBuilder } from 'discord.js';
export default {
    data: new SlashCommandBuilder()
        .setName('alert')
        .setDescription('for configure this channel like a alert fo consomation channel')
        .addNumberOption(option =>
            option.setName("alert")
                .setDescription("touts les combien de giga voulez vous etre avertis")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName("alert chanel")
                .setDescription("dans quelle salon voulez vous etre avertis ?")
                .setRequired(true))
        .addRoleOption(option =>
            option.setName("role")
                .setDescription("role qui sera ping, lors d'un raport")),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};