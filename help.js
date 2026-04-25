const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Sends a list of available commands and their descriptions.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
};