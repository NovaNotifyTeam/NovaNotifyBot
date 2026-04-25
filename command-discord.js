const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('discord')
    .setDescription('Our Discord!')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
};