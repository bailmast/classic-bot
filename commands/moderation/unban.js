const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("unban")
		.setDescription("Unban a user on the server.")
		.addUserOption(option => option
			.setName("target")
			.setDescription("The user you want to unban.")
			.setRequired(true)
		)
		.addStringOption(option => option
			.setName("reason")
			.setDescription("The reason why you want to unban a user.")
			.setRequired(false)
		),
	async execute(interaction) {
		const options = interaction.options;
		
		const member = interaction.member;
		const guild = interaction.guild;
		
		const target = options.getUser("target");
		let reason = options.getString("reason") || "No reason given";
			reason += ` : Unbanned by: ${member.user.tag} [ID: ${member.id}]`;

		const embedBotPermissions = new MessageEmbed()
			.setColor("DARK_RED")
			.setDescription(`I have no permissions to do that`);

		if (!guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
			return interaction.reply({
				embeds: [embedBotPermissions],
				ephemeral: true
			});
		};

		const embedMemberPermissions = new MessageEmbed()
			.setColor("DARK_RED")
			.setDescription(`You have no permissions to do that`);

		if (!member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
			return interaction.reply({
				embeds: [embedMemberPermissions],
				ephemeral: true
			});
        };

		const embedNotBanned = new MessageEmbed()
			.setColor("DARK_RED")
			.setDescription(`This user is not banned`);

		const embedUnbanned = new MessageEmbed()
			.setColor("DARK_GREEN")
			.setDescription(`${target} was unbanned`);

		guild.bans.fetch().then(bans => {
			if (bans.size == 0) return interaction.reply({
									embeds: [embedNotBanned],
									ephemeral: true
								});

			if (bans.find(ban => ban.user.id == target.id)) {
				guild.members.unban(bans.find(ban => ban.user.id == target.id).user, reason);

				return interaction.reply({
					embeds: [embedUnbanned]
				});
			} else {
				return interaction.reply({
					embeds: [embedNotBanned],
					ephemeral: true
				});
			};
		});
	}
};
