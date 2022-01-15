const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("coin")
		.setDescription("Flip a coin."),
	async execute(interaction) {
        const result = Math.random();

        let embed;

        if (result < 0.5) {
            embed = new MessageEmbed()
                .setColor("DARK_BUT_NOT_BLACK")
                .setDescription(`🪙 Head`);
        } else {
            embed = new MessageEmbed()
                .setColor("DARK_BUT_NOT_BLACK")
                .setDescription(`🪙 Tails`);
        }

		return interaction.reply({
			embeds: [embed]
		});
	}
};
