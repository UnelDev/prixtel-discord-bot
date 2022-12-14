import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction, ClientMe, date, discordPing) {
        interaction.deferReply();
        await process.api.ping();
        const exampleEmbed = new EmbedBuilder()
            .setTitle('test de latence')
            .setDescription('voici les statistique du serveur elle on ete mesurer en temps réel')
            .addFields(
                { name: 'temps d\'envoie de message: ', value: ((ClientMe - date) + discordPing).toString() + ' ms' },
                { name: '\u200B   client serveur:', value: '\u200B  ' + (ClientMe - date).toString() + 'ms' },
                { name: '\u200B   api Discord:', value: '\u200B  ' + discordPing.toString() + 'ms' },
                { name: 'api Prixtel', value: 'test' },
                { name: 'temps de calcul:', value: (new Date() - date).toString() + ' ms' },
            );


        await interaction.editReply({ embeds: [exampleEmbed] });
    },
};