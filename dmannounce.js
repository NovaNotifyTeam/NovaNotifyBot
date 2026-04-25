const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dmannounce')
    .setDescription('Send an announcement to all members via DM')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Announcement title')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Announcement message')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('color')
        .setDescription('Hex color (optional, e.g. #ff0000)')
        .setRequired(false)
    )
};