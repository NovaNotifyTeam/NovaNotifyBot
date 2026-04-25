const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const dmuser = require('./dmuser');
const dmannounce = require('./dmannounce');
const announcementmemes = require('./announcementmemes');

const commands = [
  announcementmemes.data,
  dmuser.data,
  dmannounce.data
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