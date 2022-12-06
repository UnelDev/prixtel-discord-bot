import { SlashCommandBuilder } from 'discord.js';
// import PrixtelAlert from '../prixtel-api/sendAlert.js';
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
    async execute(interaction, alertClass) {
        let alertChanel;
        let alert;
        let mention;
        interaction.options._hoistedOptions.forEach(element => {
            if (element.name == 'alert') {
                alert = element;
            }
            if (element.name == 'alert_chanel') {
                alertChanel = element;
            }
            if (element.name.startsWith('role')) {
                mention = element.role.name;
            }
        });
        alertClass.alert(alertChanel.value, alert.value, mention, 900000);
        await interaction.reply('alert bien prise en compte');
    },
};