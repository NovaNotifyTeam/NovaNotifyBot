const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const dmuser = require('./dmuser');
const dmannounce = require('./dmannounce');
const announcement = require('./announcement');
const discord = require('./command-discord')
const help = require('./help');

const commands = [
  help.data,
  announcement.data,
  dmuser.data,
  dmannounce.data,
  discord.data
];

function processCommands() { 
  let commandJsonList = [];
  for (const command of commands) {
    let commandJson = command.toJSON();
    console.log(`Processing command: ${commandJson.name}`);
    commandJsonList.push(commandJson);
  }
  return commandJsonList;
}

module.exports = { processCommands };