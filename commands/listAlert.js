import { SlashCommandBuilder } from 'discord.js';
export default {
    data: new SlashCommandBuilder()
        .setName('listalert')
        .setDescription('liste toute les alerte en cours de traitement'),
    async execute(interaction, alertClass) {
        await interaction.reply(alertClass.listAlertObejct());
    }
};