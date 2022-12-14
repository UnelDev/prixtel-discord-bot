import fs from 'fs';
import ChartJsImage from 'chartjs-to-image';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import * as dotenv from 'dotenv';
import path from 'node:path';
dotenv.config();
export default {

    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('create a raport of consomation of unel'),
    async execute(interaction) {
        interaction.deferReply();
        const waitImage = draw();
        const usage = await process.api.GetDataUsage();
        const exampleEmbed = new EmbedBuilder()
            .setTitle('raport de consomation')
            .setDescription('prénsente les en cour de consomation du forfait de @unelDev')
            .addFields(
                { name: 'internet:', value: await process.api.GetDataConsumme(usage), inline: true },
                { name: 'sms', value: await process.api.GetsmsSend(usage), inline: true },
                { name: 'appel', value: await process.api.GetCallTime(usage), inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: 'total de', value: await process.api.ActualPrice() },
            )
            .setTimestamp()
            .setFooter({ text: 'ces donée peut être perimé' });
        await waitImage;
        if (waitImage != 'no report data detected') {
            exampleEmbed.setImage('attachment://save.png');
            await interaction.editReply({
                embeds: [exampleEmbed],
                files: [{
                    attachment: path.resolve('./save/save.png'),
                    name: 'save.png'
                }]
            });
        } else {
            await interaction.editReply({
                embeds: [exampleEmbed]
            });
        }

    },
};
async function draw() {
    // use absolut path for 'save'
    const saveDir = path.resolve('./save');
    let listAlert = [];
    fs.readFile(path.resolve(saveDir, 'saveData.json'), 'utf8', async (err, data) => {
        if (err) {
            console.log('no report data detected');
            return ('no report data detected');
        } else {
            listAlert = JSON.parse(data);
            const name = [];
            const value = [];
            listAlert.forEach(element => {
                const date = new Date(element[0]);
                name.push(date.getDate() + '/' + date.getDate());
                value.push(element[1]);
            });
            // chartjs is limited to 250 names and 250 values
            if (name.length > 250) {
                name.splice(0, name.length - 250);

            }

            const chart = new ChartJsImage();
            chart.setConfig({
                type: 'bar',
                data: {
                    labels: name,
                    datasets: [
                        {
                            data: value
                        }
                    ]
                },
                options: {
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    callback: (val) => {
                                        return val + 'Go';
                                    }
                                }
                            }
                        ]
                    }
                }
            });
            chart.setWidth(1161);
            chart.setHeight(500);
            const buf = await chart.toBinary();

            // verify if 'save' exist and create it if dosn't exist
            fs.access(saveDir, error => {
                if (error) {
                    // the directory dosn't exist
                    fs.mkdir(saveDir, err => {
                        if (err) {
                            throw err;
                        }
                    });
                }
                //write 'alertSave.json'
                fs.writeFileSync(path.resolve(saveDir, 'save.png'), buf, err => {
                    if (err) {
                        throw err;
                    }
                });
            });
            return 'save';
        }
    });
}