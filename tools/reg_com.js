const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = function (debug = 0, discordUserId) {
  if (!discordUserId) {
    console.log('discordUserId is null!');
    return;
  }

  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v9');
  const { SlashCommandBuilder } = require('@discordjs/builders');

  //Params
  let info = require('../config');

  // Get guilds
  const ezJson = require('./ezJson');
  ezJson.openFile('./db.json');
  const {} = require('./ezJson');
  const { activity } = ezJson.getObj();
  const guildIds = Object.getOwnPropertyNames(activity);
  if (!guildIds || !guildIds.length) {
    console.log('guildIds is null!');
    return;
  }

  // Standard commands
  const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
    new SlashCommandBuilder()
      .setName('activity')
      .setDescription('выводит список неактивных указанное количество дней')
      .addNumberOption(option => option.setName('days').setDescription('количество дней').setMinValue(1).setMaxValue(30)),
    new SlashCommandBuilder().setName('activity_clear_rofl_roles').setDescription('не помню'),
    new SlashCommandBuilder().setName('activity_create_rofl_roles').setDescription('не помню'),
  ];

  //Dynamic commands
  const folder = info.folders.stickers;
  let tools = require('./tools.js');
  let files = tools.getFiles(folder, 0);
  let comms = tools.getCommands(folder, 0);
  for (let i = 0; i < comms.length; i++) {
    commands.push(new SlashCommandBuilder().setName(comms[i]).setDescription(('Sends files named: ' + files[i]).substring(0, 100)));
  }

  commands.map(command => command.toJSON());

  if (debug) {
    console.log(commands);
  }

  //Creating and saving
  const rest = new REST({ version: '9' }).setToken(process.env['DISCORD_TOKEN']);

  (async () => {
    try {
      if (debug) {
        console.log('Started refreshing application (/) commands.');
      }

      // Выставляем команды
      for (const guildId of guildIds) {
        await rest.put(Routes.applicationGuildCommands(discordUserId, guildId), {
          body: commands,
        });
      }

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.log(error);
    }
  })();
};
