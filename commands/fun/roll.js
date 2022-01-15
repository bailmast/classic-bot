const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("roll")
		.setDescription("Get a random number.")
        .addIntegerOption(option => option
			.setName("minimum")
			.setDescription("Minimum number.")
			.setRequired(true)
        )
        .addIntegerOption(option => option
            .setName("maximum")
            .setDescription("Maximum number.")
            .setRequired(true)
        ),
	async execute(interaction) {
        const options = interaction.options;

        const min = Math.ceil(options.getInteger("minimum"));
        const max = Math.floor(options.getInteger("maximum"));

        const embedMinMax = new MessageEmbed()
            .setColor("DARK_RED")
            .setDescription(`The minimum number cannot be greater than the maximum`);

        if (min > max) {
            return interaction.reply({
                embeds: [embedMinMax],
            });
        };

        const embed = new MessageEmbed()
            .setColor("DARK_BUT_NOT_BLACK")
            .setDescription(`🎲 ${Math.floor(Math.random() * (max - min + 1))}`);
        
        return interaction.reply({
            embeds: [embed],
        });
    }
};
