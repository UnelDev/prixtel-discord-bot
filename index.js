// Require the necessary discord.js classes
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import alert from './commands/alert.js';
import listAlert from './commands/listAlert.js';
import ping from './commands/ping.js';
import report from './commands/report.js';
import deploy from './deploy.js';
import prixtelApi from './prixtel-api/index.js';
import Alert from './prixtel-api/sendAlert.js';
dotenv.config();
//deply command
const pending = [];
//create a new api
process.api = new prixtelApi();
//connected to api
pending.push(process.api.Connect(process.env.EMAIL, process.env.PASSWORD));
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
process.client = client;

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        await interaction.reply({ content: 'Error this command isn\'t exist', ephemeral: true });
        return;
    }

    try {
        if (command.data.name == 'alert' || command.data.name == 'listalert') {
            await command.execute(interaction, alertClass);
        } else if (command.data.name == 'ping') {
            await command.execute(interaction, interaction.createdTimestamp, new Date(), client.ws.ping);
        } else {
            await command.execute(interaction);
        }
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

const Listcommand = [
    ping,
    report,
    listAlert,
    alert
]



//starting
console.clear();
console.log('starrting');
//add command
client.commands = new Collection();
Listcommand.forEach((element) => {
    client.commands.set(element.data.name, element);
})
//deploy command
pending.push(deploy(Listcommand));
await Promise.all(pending);
//create alert
const alertClass = new Alert();
await alertClass.restore();
// Log in to Discord with your client's token
if (process.env.ISDEV == 'true') {
    client.login(process.env.BOT_DEV_TOKEN);
} else {
    client.login(process.env.BOT_TOKEN);
}