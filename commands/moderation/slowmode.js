const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("slowmode")
		.setDescription("Set the slow mode in the current channel.")
		.addIntegerOption(option => option
			.setName("time")
			.setDescription("Time before sending the next message or creating a new thread.")
			.setRequired(true)
		),
	async execute(interaction) {
		const options = interaction.options;

		const member = interaction.member;
		const channel = interaction.channel;
		
		let time = Math.abs(options.getInteger("time"));

		const embedBotPermissions = new MessageEmbed()
			.setColor("DARK_RED")
			.setDescription(`I have no permissions to do that`);

		if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
			return interaction.reply({
				embeds: [embedBotPermissions],
				ephemeral: true
			});
		};

		const embedMemberPermissions = new MessageEmbed()
			.setColor("DARK_RED")
			.setDescription(`You have no permissions to do that`);

		if (!member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
			return interaction.reply({
				embeds: [embedMemberPermissions],
				ephemeral: true
			});
		};

		if (time > 21600) time = 21600;

		channel.setRateLimitPerUser(time);

		let embed;

		if (time > 0) {
			embed = new MessageEmbed()
				.setColor("DARK_GREEN")
				.setDescription(` Slow mode is now ${time}s`);
		} else if (channel.rateLimitPerUser === 0) {
			const embed = new MessageEmbed()
				.setColor("DARK_RED")
				.setDescription(`Slow mode is already disabled`);
		
			return interaction.reply({
				embeds: [embed],
				ephemeral: true
			});
		} else {
			embed = new MessageEmbed()
				.setColor("DARK_GREEN")
				.setDescription(`Slow mode disabled`);
		};
		
		return interaction.reply({
			embeds: [embed]
		});
	}
};
