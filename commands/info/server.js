const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("server")
        .setDescription("Shows information about the server."),
    async execute(interaction) {
        const guild = interaction.guild;

        const name = guild.name;
        const desc = guild.description || "";
        const ico = guild.iconURL() || "";
        const owner = guild.ownerId;
        const created = guild.createdAt;
        const afk = guild.afkChannel || "(Not chosen)";
        const members = guild.members.cache.filter(member => !member.user.bot).size;
        const channels = guild.channels.cache.filter(channel => channel.type !== "GUILD_CATEGORY" ).size;
        const roles = guild.roles.cache.size;
        let emojis = guild.emojis.cache.size;
        const guildID = guild.id;

        if (emojis > 10) {
            emojis = `${guild.emojis.cache.map(e => e.toString()).slice(0, 10).join(" ")} (+${emojis - 10})`;
        } else if (emojis <= 10 && emojis > 0) {
            emojis = `${guild.emojis.cache.map(e => e.toString()).slice(0, 10).join(" ")}`;
        } else if (emojis === 0) {
            emojis = "(No emojis)";
        }

        const embed = new MessageEmbed()
            .setColor("DARK_BUT_NOT_BLACK")
            .setTitle(`${name}`)
            .setDescription(`${desc}`)
            .setThumbnail(`${ico}`)
            .addField("Owner", `<@!${owner}>`, true)
            .addField("Server created", `<t:${Math.floor(created / 1000)}:R>`, true)
            .addField("AFK Channel", `${afk}`, true)
            .addField("Members", `${members}`, true)
            .addField("Channels", `${channels}`, true)
            .addField("Roles", `${roles}`, true)
            .addField("Emojis", `${emojis}`, true)
            .setFooter(`ID: ${guildID}`);

        return interaction.reply({
            embeds: [embed]
        });
    }
};
