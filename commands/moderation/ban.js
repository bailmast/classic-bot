const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ban")
		.setDescription("Ban a user on the server.")
		.addUserOption(option => option
			.setName("target")
			.setDescription("The user you want to ban.")
			.setRequired(true)
		)
		.addStringOption(option => option
			.setName("reason")
			.setDescription("The reason why you want to ban a user.")
			.setRequired(false)
		),
	async execute(interaction) {
		const client = interaction.client;
		const options = interaction.options;
		
		const member = interaction.member;
		const guild = interaction.guild;
		
		const target = options.getMember("target");
		const reason = options.getString("reason") || "No reason given";
		const reasonBans = `Banned by: ${member.user.tag} [ID: ${member.id}]`;

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

		const embedNotOnTheServer = new MessageEmbed()
			.setColor("DARK_RED")
			.setDescription(`The user is not on the server`);

		if (target == null) return interaction.reply({
			embeds: [embedNotOnTheServer],
			ephemeral: true
		});

		const embedYourself = new MessageEmbed()
			.setColor("DARK_RED")
			.setDescription(`You can not ban yourself`);

		if (target.id === member.id) {
			return interaction.reply({
				embeds: [embedYourself],
				ephemeral: true
			});
		};
		
		const embedSelfbot = new MessageEmbed()
			.setColor("DARK_RED")
			.setDescription(`I can not ban myself`);

		if (target.id === client.user.id) {
			return interaction.reply({
				embeds: [embedSelfbot],
				ephemeral: true
			});
		};
		
		const embedBannable = new MessageEmbed()
			.setColor("DARK_RED")
			.setDescription(`I have no permissions to ban this user`);

		if (!target.bannable) {
			return interaction.reply({
				embeds: [embedBannable],
				ephemeral: true
			});
		};

		const highestRoleMember = member.roles.highest;
		const highestRoleTarget = target.roles.highest;

		const embedHigher = new MessageEmbed()
			.setColor("DARK_RED")
			.setDescription(`You cannot ban this user`);

		if (highestRoleMember <= highestRoleTarget) {
			return interaction.reply({
				embeds: [embedHigher],
				ephemeral: true
			});
		};

		guild.members.ban(target, {reason: `${reason} : ${reasonBans}`});

        const embedBanned = new MessageEmbed()
            .setColor("DARK_GREEN")
            .setDescription(`${target} was banned for ${reason}`);

		return interaction.reply({
			embeds: [embedBanned]
		});
	}
};
