const {Client, Intents, Util} = require("discord.js");
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ],
});
const config = require("./config");
const fs = require("fs");
const Tools = require("./tools");

const games = [
    "Honkai Impact 3",
    "Genshin Impact",
    "Houkai Gakuen 2",
    "TeRiRi Magic Miracle",
];

const music = [
    [
        "Reburn",
        "https://www.youtube.com/watch?v=9jjsGb2lnKw&ab_channel=max20091Official",
    ],
    [
        "Girls Inside",
        "https://www.youtube.com/watch?v=9_HO2I8fxCU&ab_channel=RainBoy",
    ],
    [
        "Beffal",
        "https://www.youtube.com/watch?v=dxLsI5AKLpE&ab_channel=max20091Official",
    ],
    [
        "Nightglow",
        "https://www.youtube.com/watch?v=I4rtcJnRd6s&ab_channel=SeiReiko",
    ],
    [
        "Cyberangle",
        "https://www.youtube.com/watch?v=ngPQWAwRk70&list=PLLX1bpH-W3ZBZ9ld6U59l61hzmG0_LKLW&index=5&ab_channel=HonkaiImpact3rd",
    ],
    [
        "Dual-Ego",
        "https://www.youtube.com/watch?v=Yalse6jPbbE&list=PLLX1bpH-W3ZBZ9ld6U59l61hzmG0_LKLW&index=4&ab_channel=HonkaiImpact3rd",
    ],
    [
        "Starfall",
        "https://www.youtube.com/watch?v=CKerqp5yOGo&list=PLLX1bpH-W3ZBZ9ld6U59l61hzmG0_LKLW&index=3&ab_channel=HonkaiImpact3rd",
    ],
    [
        "Honkai Sekai no Utahime",
        "https://www.youtube.com/watch?v=empP5jaUozI&list=PLLX1bpH-W3ZBZ9ld6U59l61hzmG0_LKLW&index=9&ab_channel=HonkaiImpact3rd",
    ],
    [
        "Rubia",
        "https://www.youtube.com/watch?v=wKVJi-FLvak&list=PLLX1bpH-W3ZBZ9ld6U59l61hzmG0_LKLW&index=2&ab_channel=HonkaiImpact3rd",
    ],
    [
        "Moon Halo",
        "https://www.youtube.com/watch?v=xREK6gZxYLQ&list=PLLX1bpH-W3ZBZ9ld6U59l61hzmG0_LKLW&ab_channel=HonkaiImpact3rd",
    ],
    [
        "Chaka-chan",
        "https://www.youtube.com/watch?v=Mfxeiy9gJn0&t=30661s&ab_channel=AkkuzSad",
    ],
];

const videos = [
    [
        "ELF Academy",
        "https://www.youtube.com/watch?v=0sXTfXIA0Eo&list=PLLX1bpH-W3ZBhnY4j6G8NPEJvn4ZUXgTU&ab_channel=HonkaiImpact3rd",
    ],
    [
        "Cooking with Valkyries",
        "https://www.youtube.com/watch?v=z0MELEG5DuE&list=PLLX1bpH-W3ZBvDX5nh35dWfb56sLmh10r&ab_channel=HonkaiImpact3rd",
    ],
    [
        "Everlasting Flames",
        "https://www.youtube.com/watch?v=U9e3MFZI3zE&list=PLLX1bpH-W3ZCOeiqs3VciU_-R0geeK2XV&ab_channel=HonkaiImpact3rd",
    ],
    [
        "Shattered Samsara",
        "https://www.youtube.com/watch?v=U9e3MFZI3zE&list=PLLX1bpH-W3ZCOeiqs3VciU_-R0geeK2XV&ab_channel=HonkaiImpact3rd",
    ],
    [
        "Lament of the Fallen",
        "https://www.youtube.com/watch?v=U9e3MFZI3zE&list=PLLX1bpH-W3ZCOeiqs3VciU_-R0geeK2XV&ab_channel=HonkaiImpact3rd",
    ],
    [
        "Meteoric Salvation",
        "https://www.youtube.com/watch?v=U9e3MFZI3zE&list=PLLX1bpH-W3ZCOeiqs3VciU_-R0geeK2XV&ab_channel=HonkaiImpact3rd",
    ],
    [
        "Seele",
        "https://www.youtube.com/watch?v=U9e3MFZI3zE&list=PLLX1bpH-W3ZCOeiqs3VciU_-R0geeK2XV&ab_channel=HonkaiImpact3rd",
    ],
    [
        "Bronya",
        "https://www.youtube.com/watch?v=U9e3MFZI3zE&list=PLLX1bpH-W3ZCOeiqs3VciU_-R0geeK2XV&ab_channel=HonkaiImpact3rd",
    ],
    [
        "Final Lesson",
        "https://www.youtube.com/watch?v=U9e3MFZI3zE&list=PLLX1bpH-W3ZCOeiqs3VciU_-R0geeK2XV&ab_channel=HonkaiImpact3rd",
    ],
    [
        "Cyberangel: ZERO Exception",
        "https://www.youtube.com/watch?v=U9e3MFZI3zE&list=PLLX1bpH-W3ZCOeiqs3VciU_-R0geeK2XV&ab_channel=HonkaiImpact3rd",
    ],
    [
        "Reburn",
        "https://www.youtube.com/watch?v=U9e3MFZI3zE&list=PLLX1bpH-W3ZCOeiqs3VciU_-R0geeK2XV&ab_channel=HonkaiImpact3rd",
    ],
    [
        "Will of the Herrscher",
        "https://www.youtube.com/watch?v=Q-b6rdyIJsY&ab_channel=HonkaiImpact3rd",
    ],
];

const icons = [
    "../images/server_icon/bronya_light.gif",
    "../images/server_icon/fuhua_bonkcat.gif",
    "../images/server_icon/march7th_cookie.gif",
    "../images/server_icon/mei_tuna.gif",
    "../images/server_icon/honkai-impact-herrscher-of-thunder.gif",
    '../images/server_icon/honkai-impact-sirin.gif',
    '../images/server_icon/7560b941c497abe77f0466f62d8405a7.gif',
    '../images/server_icon/elysia.gif',
    '../images/server_icon/mei.gif',
    '../images/server_icon/mobius_1.gif',
    '../images/server_icon/mobius_2.gif',
    '../images/server_icon/mobius_3.gif',
];

//custom status doesnt work yet https://stackoverflow.com/questions/58568377/how-can-i-set-custom-status-in-discord-bot-according-to-new-update
const custom = ["I am Benares, HoV's dragon", "Dragoon"];

//Change status every 480 seconds and registr commands
client.on("ready", () => {
    //Register commands
    let reg_com = require("./reg_com.js");
    reg_com(0);
    // run every 480 seconds
    setInterval(() => {
        //Register commands
        let reg_com = require("./reg_com.js");
        reg_com(0);
        //Update server icon
        let mainGuild = client.guilds.cache.get('803319898813890620');
        let index = Math.floor(Math.random() * icons.length);
        mainGuild.setIcon(icons[index])
            .then(updated => console.log('Icon updated!!' + index))
            .catch(console.error);
        //Change status
        // generate random number between 1 and list length.
        let randomType = Math.floor(Math.random() * 3);
        if (randomType == 0) {
            let randomIndex = Math.floor(Math.random() * games.length);
            client.user.setActivity(games[randomIndex]);
        }
        else if (randomType == 1) {
            let randomIndex = Math.floor(Math.random() * music.length);
            client.user.setActivity(music[randomIndex][0], {
                type: "STREAMING",
                url: music[randomIndex][1],
            });
        }
        else if (randomType == 2) {
            let randomIndex = Math.floor(Math.random() * videos.length);
            client.user.setActivity(videos[randomIndex][0], {
                type: "STREAMING",
                url: videos[randomIndex][1],
            });
        }
    }, 480000);
    console.log(`Logged in as ${client.user.tag}!`);
});

//Message reactions
client.on("messageCreate", async(message) => {
    // Защита, чтобюы бот не отвечал самому себе
    if (message.author.bot) return;
    else if (message.content === "test") {
        message
            .reply("tested")
            .then(() =>
                console.log(
                    `Replied to message "${message.content}" from "${message.author.username}"`
                )
            )
            .catch(console.error);
        client.users.fetch("295079891055935499", false).then((user) => {
            user.send("Test msg " + message.author.username);
        });
    }
    else if (message.mentions.has(client.user)) {
        let filePath = "./index.js";
        let count = 0;
        await Tools.countFileLines(filePath)
            .then((x) => {
                count = x;
            })
            .catch(() => {
                console.log(`Error in countFileLines with path \"${filePath}\"`)
                count = "**_more then 1? i guess... sorry there is error)_**"
            });
        message.channel
            .send({
                content:
                    `I have ${count} lines of code, don't touch me... HELP! <@!295079891055935499> `,
                files: [config.folders.images + "/help.png"],
            })
            .then(() =>
                console.log(
                    `Send message on "${message.content}" from "${message.author.username}"`
                )
            )
            .catch(console.error);
    }
    else if (message.content === "yatta") {
        if (message.author.id === "295079891055935499") {
            message.delete();
            message.channel
                .send({files: [config.folders.images + "/yatta_emoji.png"]})
                .then(() =>
                    console.log(
                        `Send message on "${message.content}" from "${message.author.username}"`
                    )
                )
                .catch(console.error);
        }
        else {
            message.delete();
            message.channel
                .send({files: [config.folders.images + "/yatta_2.jpg"]})
                .then(() =>
                    console.log(
                        `Send message on "${message.content}" from "${message.author.username}"`
                    )
                )
                .catch(console.error);
        }
    }
    else if (message.content === "say yatta") {
        message.delete();
        message.channel
            .send({files: [config.folders.images + "/say_yatta.jpg"]})
            .then(() =>
                console.log(
                    `Send message on "${message.content}" from "${message.author.username}"`
                )
            )
            .catch(console.error);
    }
    else if (message.content === "thinking") {
        message.delete();
        message.channel
            .send({files: [config.folders.images + "/thinking_kiana.jpg"]})
            .then(() =>
                console.log(
                    `Send message on "${message.content}" from "${message.author.username}"`
                )
            )
            .catch(console.error);
    }
    else if (message.content === "hi") {
        message.delete();
        message.channel
            .send({files: [config.folders.images + "/hi_kiana.png"]})
            .then(() =>
                console.log(
                    `Send message on "${message.content}" from "${message.author.username}"`
                )
            )
            .catch(console.error);
    }
    else if (message.content === "not yatta") {
        message.delete();
        message.channel
            .send({files: [config.folders.images + "/not_yatta.jpg"]})
            .then(() =>
                console.log(
                    `Send message on "${message.content}" from "${message.author.username}"`
                )
            )
            .catch(console.error);
    }
    else if (message.content === "help") {
        message.channel
            .send("test, yatta, not yatta, help")
            .then(() =>
                console.log(
                    `Send message on "${message.content}" from "${message.author.username}"`
                )
            )
            .catch(console.error);
    }
    else if (message.content === "no fear") {
        message.delete();
        message.channel
            .send({files: [config.folders.images + "/no_fear.png"]})
            .then(() =>
                console.log(
                    `Send message on "${message.content}" from "${message.author.username}"`
                )
            )
            .catch(console.error);
    }
    else if (message.content === "del" && message.author.id === "295079891055935499") {
        message.channel.bulkDelete(11);
    }
    else if (message.content === 'ipdate') {
        //Update server icon
        let mainGuild = client.guilds.cache.get('803319898813890620');
        let index = Math.floor(Math.random() * icons.length);
        mainGuild.setIcon(icons[index])
            .then(updated => console.log('Icon updated!!' + index))
            .catch(console.error);
    }
    else if (message.content === 'reg_com' && message.author.id === '295079891055935499') {
        let reg_com = require("./reg_com.js");
        reg_com(1);
        message.channel.send("Complete!");
    }
    else if (message.mentions.users.size !== 0 && message.channel.id === '803321395458605056') {
      let msg = message.content;
      // Ручная проверка есть ли в сообщение упоминания
      if (msg.match(/<@.?[0-9]*?>/g)) {
        //Replace All Message Mentions Into Nothing
        msg = msg.replace(/<@.?[0-9]*?>/g, "");
      };
      msg = msg.replace(" ", "");
      if (msg === "") {
        await message.reply({
          files: [
            '../images/stupid.png'
          ],
          content: 'https://youtu.be/GQo-I3lGh9I'
        });
      }
    }
});

//Commands
client.on("interactionCreate", async(interaction) => {
    if (!interaction.isCommand()) return;
    console.log(interaction.commandName);
    if (interaction.commandName === "ping") {
        await interaction.reply("Pong!");
    }
    else {
        //Stickers from files (ONLY PNG)
        //Get last filenames for commands
        const folder = config.folders.stickers;
        let tools = require("./tools.js");
        let files = tools.getFiles(folder, 0);
        let commands = tools.getCommands(folder, 1);
        let flag = 0;
        for (let i = 0; i < commands.length; i++) {
            if (interaction.commandName === commands[i]) {
                if (fs.statSync(folder + files[i]).size <= 8387584) {
                    await interaction.reply({files: [folder + files[i]]});
                    flag = 1;
                }
                else {
                    await interaction.reply({
                        files: [config.folders.images + "too_big.png"],
                    });
                    flag = 1;
                }
            }
        }
        if (!flag) {
            await interaction.reply({
                files: [config.folders.images + "unknown_command.png"],
            });
        }
    }
});

//Create a hidden channel after someone's join in mainChannel of mainCategory
class myChannel {
    id = "0";
    isCreated = Boolean(false);
}

let mychannel = new myChannel();
let mainChannel = "884852349745627146";
let mainCategory = "803319900273115146";
let standartName = "[🦴] JoJo Stand";
let secretName = "[🟡] JOJO for ";
let notStandartName = "[🟡] Someone is JoJo [🕜]";

client.on("voiceStateUpdate", (oldState, newState) => {
    let currDate = new Date().toLocaleDateString();
    let currTime = new Date().toLocaleTimeString();
    console.log(`${currDate} ${currTime} voiceStateUpdate from Guild: ${newState.guild.name}; name = ${newState.member.user.username}`);

    //Follow user
    // const toFollowId = '295465000586182657';
    // const guildId = '803319898813890620';
    // const whoId = '295079891055935499';
    //   if (newState.member.user.id === toFollowId) {
    //     const guild = client.guilds.cache.get(guildId);
    //     guild.members.fetch(whoId)
    //     .then(user => {
    //       user.voice.setChannel(newState.member.voice.channelId);
    //     })
    //     .catch("Error in follow");
    //   }


    //Check if event happened NOT IN VOICE CHANNEL LOL
    if (newState.member.voice.channel !== undefined) {
        //No secret channel
        if (newState.channelId === mainChannel) {
            //No secret channel
            if (!mychannel.isCreated) {
                //Create usernamed channel
                newState.guild.channels
                    .create(secretName + newState.member.user.username, {
                        type: "GUILD_VOICE", //GUILD_TEXT for default
                        permissionOverwrites: [
                            {
                                id: newState.guild.roles.everyone, //To make it be seen by a certain role, user an ID instead
                                deny: ["VIEW_CHANNEL"], //Deny permission
                            },
                        ],
                        parent: mainCategory,
                    })
                    .then((chn) => {
                        //move member
                        newState.member.voice.setChannel(chn)
                            .catch(console.error);
                        mychannel.id = chn.id;
                        mychannel.isCreated = true;
                    });
                //Rename previous channel
                newState.channel.setName(notStandartName); //МЕТОД РАБОТАЕТ ЧЕРЕЗ РАЗ
            }
            //There is secret channel
            else {
                newState.member.voice.setChannel(mychannel.id)
                    .catch(console.error);
            }
        }
        //Secret channel doesnt need anymore or some Alexey moved from secret channel to main
        if (
            oldState.channelId === mychannel.id &&
            oldState.channel.members.size === 0
        ) {
            if (
                oldState.channelId === mychannel.id &&
                newState.channelId === mainChannel
            ) {
                newState.member.voice.setChannel(mychannel.id)
                    .catch(console.error);
            }
            else {
                oldState.channel.delete()
                    .catch(console.error);
                mychannel.id = "0";
                mychannel.isCreated = false;
                oldState.guild.channels.fetch(mainChannel).then((channel) => {
                    channel.setName(standartName);
                });
            }
        }
    }
});

client.login(config.token);
