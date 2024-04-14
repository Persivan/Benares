require('dotenv').config();

const {Client, GatewayIntentBits, ChannelType, PermissionsBitField} = require("discord.js");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});
const config = require("./config");
const fs = require("fs");
const Tools = require("./tools/tools");

// OpenAI
const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
});

const ezJson = require('./tools/ezJson')
ezJson.openFile('./db.json');
const db = ezJson.getObj();

// Импорт реакций на сообщения
const goodRoleHandler = require('./messageCreate/goodRole.js');

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
        "Cyberangel",
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

// const icons = [
//     "../images/server_icon/bronya_light.gif",
//     "../images/server_icon/fuhua_bonkcat.gif",
//     "../images/server_icon/march7th_cookie.gif",
//     "../images/server_icon/mei_tuna.gif",
//     "../images/server_icon/honkai-impact-herrscher-of-thunder.gif",
//     '../images/server_icon/honkai-impact-sirin.gif',
//     '../images/server_icon/7560b941c497abe77f0466f62d8405a7.gif',
//     '../images/server_icon/elysia.gif',
//     '../images/server_icon/mei.gif',
//     '../images/server_icon/mobius_1.gif',
//     '../images/server_icon/mobius_2.gif',
//     '../images/server_icon/mobius_3.gif',
// ];

//custom status doesnt work yet https://stackoverflow.com/questions/58568377/how-can-i-set-custom-status-in-discord-bot-according-to-new-update
const custom = ["I am Benares, HoV's dragon", "Dragoon"];


//Change status every 480 seconds and registr commands
client.on("ready", () => {
    //Register commands
    let reg_com = require("./tools/reg_com.js");
    reg_com(0);
    // run every 480 seconds
    setInterval(async () => {
        // Register commands
        let reg_com = require("./tools/reg_com.js");
        reg_com(0);

        // Update server icon
        // let mainGuild = client.guilds.cache.get('803319898813890620');
        // let index = Math.floor(Math.random() * icons.length);
        // mainGuild.setIcon(icons[index])
        //     .then(updated => console.log('Icon updated!!' + index))
        //     .catch(console.error);

        // Change status
        // generate random number between 1 and list length.
        let randomType = Math.floor(Math.random() * 3);
        if (randomType == 0) {
            let randomIndex = Math.floor(Math.random() * games.length);
            client.user.setActivity(games[randomIndex]);
        } else if (randomType == 1) {
            let randomIndex = Math.floor(Math.random() * music.length);
            client.user.setActivity(music[randomIndex][0], {
                type: "STREAMING",
                url: music[randomIndex][1],
            });
        } else if (randomType == 2) {
            let randomIndex = Math.floor(Math.random() * videos.length);
            client.user.setActivity(videos[randomIndex][0], {
                type: "STREAMING",
                url: videos[randomIndex][1],
            });
        }

        // Забираем/выдаем роль
        goodRoleHandler(client, db, config)

    }, 480000);
    console.log(`Logged in as ${client.user.tag}!`);
})
;

//Message reactions
client.on("messageCreate", async (message) => {
    //msgContent = AlexeyProtection(message.content);
    // Защита, чтобюы бот не отвечал самому себе
    if (message.author.bot) return;

    // обновление БД при написание сообщения
    // Добавление goodUserRoleId, users
    if (!Tools.isObjHaveRolesAndUsersArrays(db.activity, message.guildId)) {
        Tools.addProps(db.activity, `${message.guildId}.users`, []);
        Tools.addProps(db.activity, `${message.guildId}.goodUserRoleId`, "");
    }
    // Обновление даты
    let index = db.activity[message.guildId].users.findIndex((elem) => elem.id === message.author.id)
    if (index !== -1) {
        db.activity[message.guildId].users[index].lastMessageDate = Date.now();
    } else {
        db.activity[message.guildId].users.push({
            id: message.author.id,
            name: message.author.username,
            lastMessageDate: Date.now()
        })
    }
    ezJson.save(db);


    // Тест для удаления роли
    if (message.content === 'rolestest') {
        if (message.author.id === "295079891055935499") goodRoleHandler(client, db, config)
        else message.reply("Не хватает прав!")
                .catch(console.error);
    }


    if (message.content === "test") {
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

        // Реакция на упоминание сообщений бота
        // else if (message.mentions.has(client.user)) {
        //     if (message.author.id === "295079891055935499") {
        //         message.channel
        //             .send({
        //                 content:
        //                     `Yes, my master? https://www.youtube.com/watch?v=3M3x4rsyd84`
        //             })
        //             .catch(console.error);
        //         return
        //     }
        //     let filePath = "./index.js";
        //     let count = 0;
        //     await Tools.countFileLines(filePath)
        //         .then((x) => {
        //             count = x;
        //         })
        //         .catch(() => {
        //             console.log(`Error in countFileLines with path \"${filePath}\"`)
        //             count = "**_more then 1? i guess... sorry there is error)_**"
        //         });
        //     message.channel
        //         .send({
        //             content:
        //                 `I have ${count} lines of code, don't touch me... HELP! <@!295079891055935499> `,
        //             files: [config.folders.images + "/help.png"],
        //         })
        //         .then(() =>
        //             console.log(
        //                 `Send message on "${message.content}" from "${message.author.username}"`
        //             )
        //         )
        //         .catch(console.error);
        //     return;
    // }
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
        } else {
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
    } else if (message.content === "say yatta") {
        message.delete();
        message.channel
            .send({files: [config.folders.images + "/say_yatta.jpg"]})
            .then(() =>
                console.log(
                    `Send message on "${message.content}" from "${message.author.username}"`
                )
            )
            .catch(console.error);
    } else if (message.content === "thinking") {
        message.delete();
        message.channel
            .send({files: [config.folders.images + "/thinking_kiana.jpg"]})
            .then(() =>
                console.log(
                    `Send message on "${message.content}" from "${message.author.username}"`
                )
            )
            .catch(console.error);
    } else if (message.content === "hi") {
        message.delete();
        message.channel
            .send({files: [config.folders.images + "/hi_kiana.png"]})
            .then(() =>
                console.log(
                    `Send message on "${message.content}" from "${message.author.username}"`
                )
            )
            .catch(console.error);
    } else if (message.content === "not yatta") {
        message.delete();
        message.channel
            .send({files: [config.folders.images + "/not_yatta.jpg"]})
            .then(() =>
                console.log(
                    `Send message on "${message.content}" from "${message.author.username}"`
                )
            )
            .catch(console.error);
    } else if (message.content === "help") {
        message.channel
            .send("test, yatta, not yatta, help")
            .then(() =>
                console.log(
                    `Send message on "${message.content}" from "${message.author.username}"`
                )
            )
            .catch(console.error);
    } else if (message.content === "no fear") {
        message.delete();
        message.channel
            .send({files: [config.folders.images + "/no_fear.png"]})
            .then(() =>
                console.log(
                    `Send message on "${message.content}" from "${message.author.username}"`
                )
            )
            .catch(console.error);
    } else if (message.content === "del" && message.author.id === "295079891055935499") {
        message.channel.bulkDelete(11);
    } else if (message.content === 'ipdate') {
        //Update server icon
        let mainGuild = client.guilds.cache.get('803319898813890620');
        let index = Math.floor(Math.random() * icons.length);
        mainGuild.setIcon(icons[index])
            .then(updated => console.log('Icon updated!!' + index))
            .catch(console.error);
    } else if (message.content === 'reg_com' && message.author.id === '295079891055935499') {
        let reg_com = require("./tools/reg_com.js");
        reg_com(1);
        message.channel.send("Complete!");
    }

        // Кик с сервера за сообщения без упоминаний в мейне
        // else if (message.mentions.users.size !== 0 && message.channel.id === '803321395458605056') {
        //     let msg = message.content;
        //     let attachments_size = message.attachments.size;
        //     // Ручная проверка есть ли в сообщение упоминания
        //     if (msg.match(/<@.?[0-9]*?>/g)) {
        //         //Replace All Message Mentions Into Nothing
        //         console.log('someone did it again')
        //         msg = msg.replaceAll(/<@.?[0-9]*?>/g, "");
        //         msg = msg.replaceAll(" ", "");
        //     }
        //     if (msg === "" && attachments_size === 0) {
        //         await message.reply({
        //             // Ведьмак
        //             // files: [
        //             //     '../images/stupid.png'
        //             // ],
        //             // content: 'https://youtu.be/GQo-I3lGh9I'
        //             // Просто рандом
        //             content: 'bb'
        //         });
        //         await message.author.send('Vi zaebali! Не шли в мейн соообщение которые не содержат ничего кроме упоминания! https://discord.gg/hwCw6D9nQC')
        //             .catch(e => console.log(e))
        //         //if (message.author.id == '252864307694534667') {
        //             await message.member.kick('Sends an empty message with mentions in main channel')
        //                 .catch(e => console.log(e))
        //         //}
        //
        //     }
        // }


        // OpenAI чат

        // else if (isNameQuestion(msgContent)) {
        //     try {
        //         await message.reply('Меня зовут Бенарес.');
        //     } catch (e) {
        //         console.log(e);
        //     }
        // }
        // else if (isSexQuestion(msgContent)) {
        //     try {
        //         await message.reply('Я не идентифирую себе пол. Если бы, то выбрал быть девушкой.');
        //     } catch (e) {
        //         console.log(e);
        //     }
        // }
        // else if (isOldQuestion(msgContent)) {
        //     try {
        //         await message.reply('18 лет. Я родился 1 февраля 2000 года в башне Вавилона, Сибирь.');
        //     } catch (e) {
        //         console.log(e);
        //     }
    // }

    else if (message.channelId === "1062427808091099266" ||
        message.channelId === "1156308603343483010"
    ) {
        console.log(111)
        let msg = message.content;
        console.log(111)
        // Ничего не выводить если это комментарий
        if (msg.startsWith('//') || msg === "") return;
        console.log(111)
        let currDate = new Date().toLocaleDateString();
        let currTime = new Date().toLocaleTimeString();
        console.log(`${currDate} ${currTime} openAI message: "${msg}"; name = ${message.author.username}`);
        await openai.chat.completions.create({
            messages: [{role: 'user', content: msg}],
            model: 'gpt-4',
        })
            .then(async result => {
                console.log(result.choices[0].message);
                await message.reply(result.choices[0].message.content)
                    .catch(async er => (await message.reply('Something went wrong (скорее всего размер сообщения от бота более 2000 символов')))
            })
            .catch(async err => {
                console.log(err);
                try {
                    await message.reply("Something went wrong(( " + err.response.status + ": " + err.response.statusText);
                } catch (e) {
                    console.log(e);
                }

            })
    }
});

//Commands
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    console.log(interaction.commandName);
    if (interaction.commandName === "ping") {
        await interaction.reply("Pong!");
    } else if (interaction.commandName === 'activity') {
        const inactiivityList = [];
        db.activity[interaction.guildId].users.forEach((elem) => {
            let date1 = Math.floor(elem.lastMessageDate / (1000 * 60 * 60 * 24));
            let date2 = Math.floor(elem.lastVoiceStateUpdateDate / (1000 * 60 * 60 * 24));
            let currentDate = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
            console.log(elem.name)
            console.log(date1)
            console.log(date2)
            console.log(currentDate)
            if (currentDate - date1 >= interaction.options.get('days').value && currentDate - date2 >= interaction.options.get('days').value) {
                let obj = {
                    Айди: elem.id,
                    Имя: elem.name,
                }
                if (elem.lastMessageDate) obj.Посл_сообщ = `<t:${elem.lastMessageDate.toString().substring(0, 10)}:F>`;
                if (elem.lastVoiceStateUpdateDate) obj.Посл_голос = `<t:${elem.lastVoiceStateUpdateDate.toString().substring(0, 10)}:F>`;
                inactiivityList.push(obj);
            }
        })
        let message = '';
        if (inactiivityList.length !== 0) message = JSON.stringify(inactiivityList, null, 2);
        await interaction.reply(message ? `${message}` : 'Никого нет по данной выборке');
    }
    else if (interaction.commandName === 'activity_create_rofl_roles') {
        if (interaction.user.id !== '295079891055935499') {
            interaction.reply('У вас нет прав')
            return;
        }

        const inactiivityList = [];
        db.activity[interaction.guildId].users.forEach((elem) => {
            let date1 = Math.floor(elem.lastMessageDate / (1000 * 60 * 60 * 24));
            let date2 = Math.floor(elem.lastVoiceStateUpdateDate / (1000 * 60 * 60 * 24));
            let currentDate = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
            if (currentDate - date1 >= interaction.options.get('days').value && currentDate - date2 >= interaction.options.get('days').value) {
                inactiivityList.push({
                    Айди: elem.id,
                    Имя: elem.name,
                    Посл_сообщ: `<t:${elem.lastMessageDate.toString().substring(0, 9)}:F>`,
                    Посл_голос: `<t:${elem.lastVoiceStateUpdateDate.toString().substring(0, 9)}:F>`
                })
            }
        })
        let message = '';
        if (inactiivityList.length !== 0) {
            let roleId = db.activity[interaction.guildId].roles.find((elem) => elem.name === interaction.options.get('role_name').value);
            console.log(roleId);
            if (!roleId) {
                let role = await interaction.guild.roles.create({
                    name: interaction.options.get('role_name').value,
                    reason: 'Роль для тех, кто ничего не писал долгое время',
                })
                roleId = role.id
                db.activity[interaction.guildId].roles.push({
                    id: role.id,
                    name: role.name
                });
                ezJson.save(db);
            }
            message = JSON.stringify(inactiivityList, null, 2);
            // Выдача роли
            let role = interaction.guild.roles.cache.get(roleId);
            if (role) {
                for (const elem of inactiivityList) {
                    await interaction.guild.members.cache.get(elem.Айди).roles.add(role);
                }
            } else {
                console.error('роль не найдена')
            }
        }
        await interaction.reply(message ? `${message}` : 'Никого нет по данной выборке, роль не была создана');
        ezJson.save(db);
    }
    else if (interaction.commandName === 'activity_clear_rofl_roles') {
        if (interaction.user.id !== '295079891055935499') {
            interaction.reply('У вас нет прав')
            return;
        }

        let roleManager = interaction.guild.roles
        for (const elem of db.activity[interaction.guildId].roles) {
            await roleManager.delete(elem.id);
        }
        db.activity[interaction.guildId].roles = [];
        ezJson.save(db);
        interaction.reply('Удалены все "неактивные" роли')
    } else {
        //Stickers from files (ONLY PNG)
        //Get last filenames for commands
        const folder = config.folders.stickers;
        let tools = require("./tools/tools.js");
        let files = tools.getFiles(folder, 0);
        let commands = tools.getCommands(folder, 1);
        let flag = 0;
        for (let i = 0; i < commands.length; i++) {
            if (interaction.commandName === commands[i]) {
                if (fs.statSync(folder + files[i]).size <= 8387584) {
                    await interaction.reply({files: [folder + files[i]]});
                    flag = 1;
                } else {
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
    
    // обновление БД при активации голоса
    // Добавление goodUserRoleId, users
    if (!Tools.isObjHaveRolesAndUsersArrays(db.activity, newState.guildId)) {
        Tools.addProps(db.activity, `${newState.guildId}.users`, []);
        Tools.addProps(db.activity, `${newState.guildId}.goodUserRoleId`, "");
    }
    let index = db.activity[newState.guild.id].users.findIndex((elem) => elem.id === newState.member.user.id)
    if (index !== -1) {
        db.activity[newState.guild.id].users[index].lastVoiceStateUpdateDate = Date.now();
    } else {
        db.activity[newState.guild.id].users.push({
            id: newState.member.user.id,
            name: newState.member.user.username,
            lastVoiceStateUpdateDate: Date.now()
        })
    }
    ezJson.save(db);

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
    //if (newState.member.guild.id === '803319898813890620') {
    //    newState.member.setNickname(null)
    //        .catch(console.log);
    //}

    //Yarik only 1 channel
    /*    const toFollowId = '968569427991887872';    //id куда перекидывать
        const whoId = '295465000586182657';         //id чела которого перекидывать
        if (newState.member.user.id === whoId && newState.member.voice.id !== toFollowId) {
            newState.member.voice.setChannel(toFollowId)
                .catch(console.error);
        }*/


    //Check if event happened NOT IN VOICE CHANNEL LOL
    if (newState.member.voice.channel !== undefined) {
        //No secret channel
        if (newState.channelId === mainChannel) {
            //No secret channel
            if (!mychannel.isCreated) {
                //Create usernamed channel
                newState.guild.channels
                    .create({
                        name: secretName + newState.member.user.username,
                        type: ChannelType.GuildVoice,
                        permissionOverwrites: [
                            {
                                id: newState.guild.roles.everyone, //To make it be seen by a certain role, user an ID instead
                                deny: [new PermissionsBitField().add()], //Deny permission
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
            } else {
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

client.login(process.env['DISCORD_TOKEN']);
