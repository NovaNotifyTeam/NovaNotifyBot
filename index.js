require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ActivityType, REST, Routes } = require('discord.js');
const express = require('express');
const app = express();
const port = 3000;

const { processCommands } = require('./deploy-commands');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.AutoModerationConfiguration, GatewayIntentBits.AutoModerationExecution]
});

client.on("clientReady", async () => {
    console.log(`${client.user.tag} is online!`);
    try {
        await client.application.commands.set([]);
        console.log('Successfully deleted all global commands.');
    } catch (err) {
        console.error('Failed to delete global commands:', err);
    }
    const processedCommands = processCommands();
    for (const command of processedCommands) {
        console.log(`Registering command: ${command.name}`);
        try {
            for (const guildId of client.guilds.cache.map(guild => guild.id)) {
                await client.application.commands.create(command, guildId);
            }
        } catch (err) {
            console.error(`Failed to register command ${command.name}:`, err);
        }
    }

    client.user.setActivity('V1.2', {
        type: ActivityType.Competing
    });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    switch (interaction.commandName) {
        case 'announcement':
            await handleAnnouncement(interaction);
            break;
        case 'dmuser':
            await handleDmUser(interaction);
            break;
        case 'dmannounce':
            await handleDmAnnounce(interaction);
            break;
        case 'discord':
            await handleDiscord(interaction);
            break;
        case 'help':
            await handleHelp(interaction);
            break;
        default:
            break;
    }
});

async function handleHelp(interaction) {
    const embed = new EmbedBuilder()
        .setTitle('NovaNotify Help')
        .setDescription(`**Available Commands:**\n\n**/announcement** - Send an announcement to the current channel.\n**/dmuser** - DM a specific user with a custom message.\n**/dmannounce** - DM all members of the server with a custom message.\n**/discord** - Get the link to our support Discord server.\nhttps://novanotifystatus.upbot.app\n\nFor detailed usage of each command, please join our Discord for support!`)
        .setColor('#ff0000')
        .setTimestamp();
            
    await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function handleDiscord(interaction) {
    const embed = new EmbedBuilder()
        .setTitle('Join Our Discord for Support!')
        .setDescription(`Thank you for choosing **NovaNotify**!\nIf you could please join our discord for future updates that would be much appreciated!\nhttps://discord.gg/rYzgYHXFAX`)
        .setColor('#e60ee6')
        .setTimestamp();
    
    await interaction.channel.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ Here\'s the link to our discord!', ephemeral: true });
}

async function handleAnnouncement(interaction) {
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('message');
    const color = interaction.options.getString('color') || '#00ffcc';

    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp();

    await interaction.channel.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ Announcement sent!', ephemeral: true });
}

async function handleDmUser(interaction) {
    const user = interaction.options.getUser('user');
    const title = interaction.options.getString('title');
    const message = interaction.options.getString('message');
    const color = interaction.options.getString('color') || '#00ffcc';

    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(message)
        .setColor(color)
        .setFooter({ text: `Sent from ${interaction.guild.name}` })
        .setTimestamp();

    try {
        await user.send({ embeds: [embed] });
        await interaction.reply({ content: `✅ Message sent to **${user.tag}**`, ephemeral: true });
    } catch (err) {
        await interaction.reply({ content: `❌ Could not DM **${user.tag}** (DMs may be off)`, ephemeral: true });
    }
}

async function handleDmAnnounce(interaction) {
    const title = interaction.options.getString('title');
    const message = interaction.options.getString('message');
    const color = interaction.options.getString('color') || '#00ffcc';

    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(message)
        .setColor(color)
        .setFooter({ text: `Sent from ${interaction.guild.name}` })
        .setTimestamp();

    await interaction.reply({ content: '📨 Sending DMs to **all** members... This may take a moment.', ephemeral: true });

    const members = await interaction.guild.members.fetch();
    let sent = 0;
    let failed = 0;

    for (const member of members.values()) {
        if (member.user.bot) continue;
        try {
            await member.send({ embeds: [embed] });
            sent++;
        } catch (err) {
            console.log(`Failed to DM ${member.user.tag}:`, err);
            failed++;
        }
    }

    await interaction.followUp({ content: `✅ Done!\n📨 Sent: **${sent}**\n❌ Failed: **${failed}**`, ephemeral: true });
}

client.login(process.env.TOKEN);