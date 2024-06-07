module.exports = async (interaction, log, ezJson, db) => {
  const inactivityList = [];
  db.activity[interaction.guildId].users.forEach(elem => {
    let date1 = Math.floor(elem.lastMessageDate / (1000 * 60 * 60 * 24));
    let date2 = Math.floor(elem.lastVoiceStateUpdateDate / (1000 * 60 * 60 * 24));
    let currentDate = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    log(elem.name);
    log(date1);
    log(date2);
    log(currentDate);
    if (currentDate - date1 >= interaction.options.get('days').value && currentDate - date2 >= interaction.options.get('days').value) {
      let obj = {
        Айди: elem.id,
        Имя: elem.name,
      };
      if (elem.lastMessageDate) obj.Посл_сообщ = `<t:${elem.lastMessageDate.toString().substring(0, 10)}:F>`;
      if (elem.lastVoiceStateUpdateDate) obj.Посл_голос = `<t:${elem.lastVoiceStateUpdateDate.toString().substring(0, 10)}:F>`;
      inactivityList.push(obj);
    }
  });
  let message = '';
  if (inactivityList.length !== 0) message = JSON.stringify(inactivityList, null, 2);
  await interaction.reply(message ? `${message}` : 'Никого нет по данной выборке');
};
