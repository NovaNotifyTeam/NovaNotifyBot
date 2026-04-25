require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');
const { processCommands } = require('./deploy-commands');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.AutoModerationConfiguration, GatewayIntentBits.AutoModerationExecution]
});

client.on("clientReady", async () => {
    console.log(`${client.user.tag} is online!`);

    const processedCommands = processCommands();
    for (const command of processedCommands) {
        console.log(`Registering command: ${command.name}`);
        try {
            await client.application.commands.delete(command);
            await client.application.commands.create(command);
        } catch (err) {
            console.error(`Failed to register command ${command.name}:`, err);
        }
    }

    client.user.setActivity('Coding Myself', {
        type: ActivityType.Competing
    });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    switch (interaction.commandName) {
        case 'announcementmemes':
            await handleAnnouncementMemes(interaction);
            break;
        case 'dmuser':
            await handleDmUser(interaction);
            break;
        case 'dmannounce':
            await handleDmAnnounce(interaction);
            break;
        default:
            break;
    }
});

async function handleAnnouncementMemes(interaction) {
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('message');
    const color = interaction.options.getString('color') || '#00ffcc';

    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp();

    await interaction.channel.send({ embeds: [embed] });
    client.user.setActivity(description, { type: ActivityType.Playing });
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

    await interaction.reply({ content: '📨 Sending DMs to all members... This may take a moment.', ephemeral: true });

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

    await interaction.followUp({ content: '✅ Done!\n📨 Sent: **${sent}**\n❌ Failed: **${failed}**', ephemeral: true });
}

client.login(process.env.TOKEN);