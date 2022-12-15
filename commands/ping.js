import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction, ClientMe, date, discordPing) {
        const envenLoop = new Date() - date;
        interaction.deferReply();
        const apiPing = await process.api.ping();
        const exampleEmbed = new EmbedBuilder()
            .setTitle('test de latence')
            .setDescription('voici les statistique du serveur elle on ete mesurer en temps réel')
            .addFields(
                { name: 'temps d\'envoie de message: ', value: ((ClientMe - date) + discordPing).toString() + ' ms' },
                { name: '\u200B   client serveur:', value: '\u200B  ' + (ClientMe - date).toString() + 'ms' },
                { name: '\u200B   api Discord:', value: '\u200B  ' + discordPing.toString() + 'ms' },
                { name: 'api Prixtel', value: (apiPing.RefreshTime + apiPing.connectTime).toString() + 'ms' },
                { name: '\u200B   temps de connection', value: '\u200B  ' + apiPing.connectTime.toString() + 'ms' },
                { name: '\u200B   temps de rafrechissement', value: '\u200B  ' + apiPing.RefreshTime.toString() + 'ms' },
                {
                    name: 'temps de calcul:', value: (envenLoop).toString() + ' ms'
                },
            );


        await interaction.editReply({ embeds: [exampleEmbed] });
    },
};