import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
export default {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('create a raport of consomation of unel'),
    async execute(interaction) {
        const exampleEmbed = new EmbedBuilder()
            .setTitle('raport de consomation')
            .setDescription('prensente les en cour de consomation du forfait de @unelDev')
            .addFields(
                { name: 'Regular field title', value: 'Some value here' },
                { name: '\u200B', value: '\u200B' },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'ces donée peut être perimé' });

        await interaction.reply({ embeds: [exampleEmbed] });
    },
};