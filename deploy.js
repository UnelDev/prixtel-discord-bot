import { REST, Routes } from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config();


// and deploy your commands!
async function deploy(Listcommand) {
    const commands = [];
    Listcommand.forEach(element => {
        commands.push(element.data.toJSON());
    });


    // Construct and prepare an instance of the REST module
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        //deploy il all server:
        // await rest.put(
        //     Routes.applicationCommands(clientId),
        //     { body: commands },
        // );
        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.APPID, process.env.SERVID),
            { body: commands },
        );
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
};
export default deploy;