import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import prixtelApi from '../prixtel-api/index.js';
import * as dotenv from 'dotenv';
dotenv.config();
export default {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('create a raport of consomation of unel'),
    async execute(interaction) {
        interaction.deferReply();
        const api = new prixtelApi();
        const page = await api.Connect(process.env.EMAIL, process.env.PASSWORD);
        const usage = await api.GetDataUsage(page);
        const exampleEmbed = new EmbedBuilder()
            .setTitle('raport de consomation')
            .setDescription('prénsente les en cour de consomation du forfait de @unelDev')
            .addFields(
                { name: 'internet:', value: await api.GetDataConsumme(usage), inline: true },
                { name: 'sms', value: await api.GetsmsSend(usage), inline: true },
                { name: 'appel', value: await api.GetCallTime(usage), inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: 'total de', value: await api.ActualPrice() },
            )
            .setTimestamp()
            .setFooter({ text: 'ces donée peut être perimé' });

        await interaction.editReply({ embeds: [exampleEmbed] });
    },
};