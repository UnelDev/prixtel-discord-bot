import { SlashCommandBuilder } from 'discord.js';
import PrixtelAlert from '../prixtel-api/sendAlert.js';
export default {
    data: new SlashCommandBuilder()
        .setName('alert')
        .setDescription('for configure this channel like a alert fo consomation channel')
        .addNumberOption(option =>
            option.setName("alert")
                .setDescription("touts les combien de giga voulez vous etre avertis")
                .setRequired(true)
        )
        .addChannelOption(channel => {
            return channel // Add return here
                .setName("alert_chanel")
                .setDescription("dans quel salon voulez vous etre averti ?")
                .setRequired(true)
        })
        .addRoleOption(option =>
            option.setName("role")
                .setDescription("role qui sera ping, lors d'un raport")),
    async execute(interaction) {
        console.log(interaction.options._hoistedOptions);
        let alertChanel;
        let alert;
        interaction.options._hoistedOptions.forEach(element => {
            if (element.name == 'alert') {
                alert = element;
            }
            if (element.name == 'alert_chanel') {
                alertChanel = element;
            }
        });
        await interaction.reply('Pong! :ping_pong:');
        PrixtelAlert(alertChanel.value, 5000, alert.value)
    },
};