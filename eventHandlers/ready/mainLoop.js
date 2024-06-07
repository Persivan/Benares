module.exports = (client, reg_com, goodRoleHandler, config, db, constants) => {
    setInterval(async () => {
        //Register commands
        reg_com(0, client.user.id);
        // Забираем/выдаем роль
        goodRoleHandler(client, db, config)

        // Update server icon
        // let mainGuild = client.guilds.cache.get('803319898813890620');
        // let index = Math.floor(Math.random() * icons.length);
        // mainGuild.setIcon(icons[index])
        //     .then(updated => log('Icon updated!!' + index))
        //     .catch(console.error);

        // Change status
        // generate random number between 1 and list length.
        let randomType = Math.floor(Math.random() * 3);
        if (randomType === 0) {
            let randomIndex = Math.floor(Math.random() * constants.games.length);
            client.user.setActivity(constants.games[randomIndex]);
        }
        else if (randomType === 1) {
            let randomIndex = Math.floor(Math.random() * constants.music.length);
            client.user.setActivity(constants.music[randomIndex][0], {
                type: "STREAMING",
                url: constants.music[randomIndex][1],
            });
        }
        else if (randomType === 2) {
            let randomIndex = Math.floor(Math.random() * constants.videos.length);
            client.user.setActivity(videos[randomIndex][0], {
                type: "STREAMING",
                url: constants.video[randomIndex][1],
            });
        }
    }, 480000);
}