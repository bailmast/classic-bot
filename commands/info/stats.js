const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("stats")
		.setDescription("Shows the bot statistics."),
	async execute(interaction) {
		const client = interaction.client;
		
		const guilds = client.guilds.cache.size;
		const users = client.users.cache.filter(user => !user.bot).size;
		const channels = client.channels.cache.filter(channel => channel.type !== "GUILD_CATEGORY" ).size;
		const pingMessage = new Date() - interaction.createdTimestamp;
		const pingAPI = client.ws.ping;

        const embed = new MessageEmbed()
            .setColor("DARK_BUT_NOT_BLACK")
            .addField("Servers", `${guilds}`, true)
            .addField("Users", `${users}`, true)
            .addField("Channels", `${channels}`, true)
            .addField("Latency", `Message: ${pingMessage}ms\nAPI: ${pingAPI}ms`);

		return interaction.reply({
			embeds: [embed]
		});
	}
};
