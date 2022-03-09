//Creating commands for bot with Params from token.js
module.exports = function (debug = 0) {
  const { REST } = require("@discordjs/rest");
  const { Routes } = require("discord-api-types/v9");
  const { SlashCommandBuilder } = require("@discordjs/builders");

  //Params
  var info = require("./config");

  //Standart commands
  const commands = [
    new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Replies with Pong!"),
  ];

  //Dynamic commands
  const folder = info.folders.stickers;
  var tools = require("./tools.js");
  var files = tools.getFiles(folder, 1);
  var comms = tools.getCommands(folder, 1);
  for (let i = 0; i < comms.length; i++) {
    commands.push(
      new SlashCommandBuilder()
        .setName(comms[i])
        .setDescription(("Sends files named: " + files[i]).substring(0, 100))
    );
  }

  commands.map((command) => command.toJSON());

  if (debug) {
    console.log(commands);
  }

  //Creating and saving
  const rest = new REST({ version: "9" }).setToken(info.token);

  (async () => {
    try {
      if (debug) {
        console.log("Started refreshing application (/) commands.");
      }

      await rest.put(
        Routes.applicationGuildCommands(info.ClientId, info.GuildId),
        {
          body: commands,
        }
      );

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.log(error);
    }
  })();
};
