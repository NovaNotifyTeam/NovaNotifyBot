const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announcementmemes')
        .setDescription('Send an announcement')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Title')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Hex color (optional, e.g. #00ffcc)')
                .setRequired(false))
};