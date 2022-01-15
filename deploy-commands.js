const { config } = require("dotenv");
const { readdirSync } = require("fs");

const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9");

config();

const commands = [];

const folders = readdirSync("./commands");

for (const folder of folders) {
	const files = readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
	
	for (const file of files) {
		const command = require(`./commands/${folder}/${file}`);
		commands.push(command.data.toJSON());
	};
};

new REST({ version: '9' })
	.setToken(process.env.TOKEN)
	.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
	.then(() => console.log("Successfully registered application commands."))
	.catch(console.error);
