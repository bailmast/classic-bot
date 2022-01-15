const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Shows information about you or another user.")
        .addUserOption(option => option
            .setName("target")
            .setDescription("The user you want to view information about.")
            .setRequired(false)
        ),
    async execute(interaction) {
        const options = interaction.options;

        const member = interaction.member;
        const user = interaction.user;
        
        const target = options.getMember("target");
        const targetUser = options.getUser("target");

        const avatar = user.displayAvatarURL({ dynamic: true }).replace("webp", "png");
        const created = user.createdTimestamp;
        const joined = member.joinedTimestamp;
        const roles = member.roles.cache.map(role => role.toString()).join(" ");

        let embed;

        if (!target) {
            embed = new MessageEmbed()
                .setColor("DARK_BUT_NOT_BLACK")
                .setAuthor(`${user.tag}`)
                .setThumbnail(avatar)
                .addField("Account created", `<t:${Math.floor(created / 1000)}:R>`, true)
                .addField("Joined server", `<t:${Math.floor(joined / 1000)}:R>`, true)
                .addField("Roles", `${roles}`)
                .setFooter(`ID: ${user.id}`);
        } else {
            const targetAvatar = targetUser.displayAvatarURL({ dynamic: true }).replace("webp", "png");
            const createdTarget = targetUser.createdTimestamp;
            const joinedTarget = target.joinedTimestamp;
            const rolesTarget = target.roles.cache.map(role => role.toString()).join(" ");

            embed = new MessageEmbed()
                .setColor("DARK_BUT_NOT_BLACK")
                .setAuthor(`${targetUser.tag}`)
                .setThumbnail(targetAvatar)
                .addField("Account created", `<t:${Math.floor(createdTarget / 1000)}:R>`, true)
                .addField("Joined server", `<t:${Math.floor(joinedTarget / 1000)}:R>`, true)
                .addField("Roles", `${rolesTarget}`)
                .setFooter(`ID: ${target.id}`);
        }

        return interaction.reply({
            embeds: [embed]
        });
    }
};