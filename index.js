// Импорт глобальных библиотек
const path = require('path');
const fs = require('fs');

// Импорт кастомных библиотек

const config = require('./config');
const Tools = require('./tools/tools');
const ezJson = require('./tools/ezJson');
const { log } = require('./tools/tools');
const reg_com = require('./tools/reg_com');
const goodRoleHandler = require('./tools/goodRole');

require('dotenv').config();

// Discord
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

// OpenAI
const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

// Загрузка БД
ezJson.openFile('./db.json');
const db = ezJson.getObj();

// Загрузка констант
const loadConstants = require('./const/loadConstants');
const constants = loadConstants(path.join(__dirname, 'const'));

// Bot is ready
// Import the handlers
const mainLoop = require('./eventHandlers/ready/mainLoop');
const setStatus = require('./eventHandlers/ready/setStatus');

client.on('ready', () => {
  // Логирование
  log(`Logged in as ${client.user.tag}!`);

  // Регистрация команд
  reg_com(0, client.user.id);
  // Забираем/выдаем роль
  goodRoleHandler(client, db, log);
  // Устанавливаем статус
  setStatus(client, constants);
  // Цикл (480 сек)
  mainLoop(client, reg_com, goodRoleHandler, config, db, constants, log);
});

// Message reactions
// Import the handlers
const messageProtection = require('./eventHandlers/messageCreate/messageProtection');
const specificMessages = require('./eventHandlers/messageCreate/specificMessages');
const updateDatabaseMsg = require('./eventHandlers/messageCreate/updateDatabase');
const mentionsAndAI = require('./eventHandlers/messageCreate/mentionsAndAI');

client.on('messageCreate', async message => {
  // Защита, чтобюы бот не отвечал самому себе
  if (messageProtection(message)) return;

  // Call the database update handler
  updateDatabaseMsg(message, db, ezJson, Tools);

  // Call the specific messages handler
  await specificMessages(message, client, log);

  // Call the mentions and OpenAI handler
  await mentionsAndAI(message, client, log, Tools, openai, config);
});

//Commands
// Import the handlers
const activity = require('./eventHandlers/interactionCreate/activity');
const activity_create_rofl_roles = require('./eventHandlers/interactionCreate/activity_create_rofl_roles');
const activity_clear_rofl_roles = require('./eventHandlers/interactionCreate/activity_clear_rofl_roles');
const ping = require('./eventHandlers/interactionCreate/ping');
const defaultinteraction = require('./eventHandlers/interactionCreate/default');

client.on('interactionCreate', async interaction => {
  // Защита
  if (!interaction.isCommand()) return;

  // Логирование
  log('interactionCreate - ' + interaction.commandName);

  // Route the interaction to the appropriate handler
  try {
    switch (interaction.commandName) {
      case 'ping':
        await ping(interaction);
        break;
      case 'activity':
        await activity(interaction, log, ezJson, db);
        break;
      case 'activity_create_rofl_roles':
        await activity_create_rofl_roles(interaction, log, ezJson, db);
        break;
      case 'activity_clear_rofl_roles':
        await activity_clear_rofl_roles(interaction, ezJson, db);
        break;
      default:
        await defaultinteraction(interaction, fs, config, Tools);
        break;
    }
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});

// Voice updates
// Import the handlers
const updateDatabaseVoice = require('./eventHandlers/voiceStateUpdate/updateDatabase');
const createJojoChannel = require('./eventHandlers/voiceStateUpdate/createJojoChannel');

client.on('voiceStateUpdate', (oldState, newState) => {
  // Логирование
  log(`voiceStateUpdate - from Guild: ${newState.guild.name}; name = ${newState.member.user.username}`);

  // обновление БД при активации голоса
  updateDatabaseVoice(newState, db, ezJson, Tools);

  // Создание скрытого канала
  createJojoChannel(oldState, newState);
});

client.login(process.env['DISCORD_TOKEN']);
