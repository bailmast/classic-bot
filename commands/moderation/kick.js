const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("kick")
		.setDescription("Kick a user from the server.")
		.addUserOption(option => option
			.setName("target")
			.setDescription("The user you want to kick.")
			.setRequired(true)
		)
		.addStringOption(option => option
			.setName("reason")
			.setDescription("The reason why you want to kick a user.")
			.setRequired(false)
		),
	async execute(interaction) {
		const client = interaction.client;
		const options = interaction.options;
		
		const member = interaction.member;
		const guild = interaction.guild;
		
		const target = options.getMember("target");
		const reason = options.getString("reason") || "No reason given";
		const reasonAudit = `Kicked by: ${member.user.tag} [ID: ${member.id}]`;

		const embedBotPermissions = new MessageEmbed()
			.setColor("DARK_RED")
			.setDescription(`I have no permissions to do that`);

		if (!guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
			return interaction.reply({
				embeds: [embedBotPermissions],
				ephemeral: true
			});
		};

		const embedMemberPermissions = new MessageEmbed()
			.setColor("DARK_RED")
			.setDescription(`You have no permissions to do that`);

		if (!member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
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
			.setDescription(`You can not kick yourself`);

		if (target.id === member.id) {
			return interaction.reply({
				embeds: [embedYourself],
				ephemeral: true
			});
		};
		
		const embedSelfbot = new MessageEmbed()
			.setColor("DARK_RED")
			.setDescription(`I can not kick myself`);

		if (target.id === client.user.id) {
			return interaction.reply({
				embeds: [embedSelfbot],
				ephemeral: true
			});
		};
		
		const embedKickable = new MessageEmbed()
			.setColor("DARK_RED")
			.setDescription(`I have no permissions to kick this user`);

		if (!target.kickable) {
			return interaction.reply({
				embeds: [embedKickable],
				ephemeral: true
			});
		};

		const highestRoleMember = member.roles.highest;
		const highestRoleTarget = target.roles.highest;

		const embedHigher = new MessageEmbed()
			.setColor("DARK_RED")
			.setDescription(`You cannot kick this user`);

		if (highestRoleMember <= highestRoleTarget) {
			return interaction.reply({
				embeds: [embedHigher],
				ephemeral: true
			});
		};

		guild.members.kick(target, `${reason} : ${reasonAudit}`);

        const embedKicked = new MessageEmbed()
            .setColor("DARK_GREEN")
            .setDescription(`${target} was kicked for ${reason}`);

		return interaction.reply({
			embeds: [embedKicked]
		});
	}
};
