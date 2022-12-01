
import { REST, Routes } from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config();

let guildId = process.env.SERVID;
let clientId = process.env.APPID;
let token = process.env.BOT_TOKEN;
let serverName = 'test de unel';

const rest = new REST({ version: '9' }).setToken(token);


(async () => {
	try {
		console.log('Removing commands on ' + serverName + '...');
		await rest.get(Routes.applicationGuildCommands(clientId, guildId)).then(data => {
			const promises = [];
			for (const Command of data) {
				promises.push(rest.delete(`${Routes.applicationGuildCommands(clientId, guildId)}/${Command.id}`));
			}
			return Promise.all(promises);
		});
		console.log('Commands removed on ' + serverName);
	}
	catch (e) {
		console.log(e);
	}
})();