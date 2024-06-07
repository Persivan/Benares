const setStatus = require('./setStatus');

module.exports = (client, reg_com, goodRoleHandler, config, db, constants, log) => {
  setInterval(async () => {
    //Register commands
    reg_com(0, client.user.id);
    // Забираем/выдаем роль
    goodRoleHandler(client, db, log);

    // Update server icon
    // let mainGuild = client.guilds.cache.get('803319898813890620');
    // let index = Math.floor(Math.random() * icons.length);
    // mainGuild.setIcon(icons[index])
    //     .then(updated => log('Icon updated!!' + index))
    //     .catch(console.error);

    // Change status
    setStatus(client, constants);
  }, 480000);
};
