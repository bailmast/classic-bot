const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("purge")
		.setDescription("Clear a certain amount of messages.")
		.addIntegerOption(option => option
			.setName("amount")
			.setDescription("Amount of messages to clear.")
			.setRequired(true)
		),
	async execute(interaction) {
		const options = interaction.options;

		const member = interaction.member;
        const channel = interaction.channel;
		
		let amount = Math.abs(options.getInteger("amount"));

		const embedBotPermissions = new MessageEmbed()
			.setColor("DARK_RED")
			.setDescription(`I have no permissions to do that`);

		if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
			return interaction.reply({
				embeds: [embedBotPermissions],
				ephemeral: true
			});
		};

		const embedMemberPermissions = new MessageEmbed()
			.setColor("DARK_RED")
			.setDescription(`You have no permissions to do that`);

		if (!member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
			return interaction.reply({
				embeds: [embedMemberPermissions],
				ephemeral: true
			});
		};

		const embedNull = new MessageEmbed()
			.setColor("DARK_RED")
			.setDescription(`The amount can not be zero or lower`);

		if (amount === 0) {
			return interaction.reply({
				embeds: [embedNull],
				ephemeral: true
			});
		};

		if (amount > 100) amount = 100;

		try {
			channel.bulkDelete(amount, false)
				.then(messages => {
					if (messages.size > 0) {
						const embed = new MessageEmbed()
							.setColor("DARK_GREEN")
							.setDescription(`Cleared ${messages.size} messages`);

							return interaction.reply({
								embeds: [embed]
							});
					} else {
						const embed = new MessageEmbed()
							.setColor("DARK_RED")
							.setDescription(`There is nothing to clear`);

						return interaction.reply({
							embeds: [embed],
							ephemeral: true
						});
					};
				});
		} catch (e) {
			const embedError = new MessageEmbed()
				.setColor("DARK_RED")
				.setDescription("Unfortunately I can\"t clear the message(s)");

			return interaction.reply({ 
				embeds: [embedError], 
				ephemeral: true
			});
		};
	}
};
