const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dmuser')
    .setDescription('Send a DM to a specific user')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to DM')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Message title')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Message content')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('color')
        .setDescription('Hex color (optional, e.g. #00ffcc)')
        .setRequired(false)
    )
};