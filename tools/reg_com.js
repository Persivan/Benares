//Creating commands for bot with Params from token.js
const {SlashCommandBuilder} = require("@discordjs/builders");
const {Routes} = require("discord-api-types/v9");
module.exports = function (debug = 0) {
    const {REST} = require("@discordjs/rest");
    const {Routes} = require("discord-api-types/v9");
    const {SlashCommandBuilder} = require("@discordjs/builders");

    //Params
    let info = require("../config");

    //Standart commands
    const commands = [
        new SlashCommandBuilder()
            .setName("ping")
            .setDescription("Replies with Pong!"),
        new SlashCommandBuilder()
            .setName("activity")
            .setDescription("Вычисляет всех неактивных")
            .addNumberOption((option) => option.setName("days").setDescription("кол-во дней").setRequired(true)),
        new SlashCommandBuilder()
            .setName("activity_create_rofl_roles")
            .setDescription("Выставляет всем неактивным рофло роль (Инактив X дней)")
            .addNumberOption((option) => option.setName("days").setDescription("кол-во дней").setRequired(true))
            .addStringOption((option) => option.setName("role_name").setDescription("название роли инактива").setRequired(true)),
        new SlashCommandBuilder()
            .setName("activity_clear_rofl_roles")
            .setDescription("Удаляет все роли инактиверов")
    ];

    //Dynamic commands
    const folder = info.folders.stickers;
    let tools = require("./tools.js");
    let files = tools.getFiles(folder, 0);
    let comms = tools.getCommands(folder, 0);
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
    const rest = new REST({version: "9"}).setToken(process.env['DISCORD_TOKEN']);

    (async () => {
        try {
            if (debug) {
                console.log("Started refreshing application (/) commands.");
            }

            // Выставляем команды
            for (const elem of info.guilds) {
                await rest.put(
                    Routes.applicationGuildCommands(process.env['CLIENT_ID'], elem.id),
                    {
                        body: commands,
                    }
                );
            }

            console.log("Successfully reloaded application (/) commands.");
        } catch (error) {
            console.log(error);
        }
    })();
};
