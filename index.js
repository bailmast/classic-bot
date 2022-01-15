const { readdirSync } = require("fs");

const { Client, Intents, Collection, MessageEmbed } = require("discord.js");
const { config } = require("dotenv");

config();

const client = new Client({ 
    intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS
	]
});

require("./deploy-commands");

client.commands = new Collection();

const folders = readdirSync("./commands");

for (const folder of folders) {
	const files = readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
	
	for (const file of files) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.data.name, command);
	};
};

client.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (e) {
		const embedError = new MessageEmbed()
			.setColor("DARK_RED")
			.setDescription("Oops... Something went wrong ;(");

		console.error(e);

		return interaction.reply({ 
			embeds: [embedError], 
			ephemeral: true
		});
	};
});

client.once("ready", () => {
	console.log(`${client.user.tag} is ready!`);
});

client.login(process.env.TOKEN);
