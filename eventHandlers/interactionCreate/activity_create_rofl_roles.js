module.exports = async (interaction, log, ezjson, db) => {
  if (interaction.user.id !== '295079891055935499') {
    interaction.reply('У вас нет прав');
    return;
  }

  const inactivityList = [];
  db.activity[interaction.guildId].users.forEach(elem => {
    let date1 = Math.floor(elem.lastMessageDate / (1000 * 60 * 60 * 24));
    let date2 = Math.floor(elem.lastVoiceStateUpdateDate / (1000 * 60 * 60 * 24));
    let currentDate = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    if (currentDate - date1 >= interaction.options.get('days').value && currentDate - date2 >= interaction.options.get('days').value) {
      inactivityList.push({
        Айди: elem.id,
        Имя: elem.name,
        Посл_сообщ: `<t:${elem.lastMessageDate.toString().substring(0, 9)}:F>`,
        Посл_голос: `<t:${elem.lastVoiceStateUpdateDate.toString().substring(0, 9)}:F>`,
      });
    }
  });
  let message = '';
  if (inactivityList.length !== 0) {
    let roleId = db.activity[interaction.guildId].roles.find(elem => elem.name === interaction.options.get('role_name').value);
    log(roleId);
    if (!roleId) {
      let role = await interaction.guild.roles.create({
        name: interaction.options.get('role_name').value,
        reason: 'Роль для тех, кто ничего не писал долгое время',
      });
      roleId = role.id;
      db.activity[interaction.guildId].roles.push({
        id: role.id,
        name: role.name,
      });
      ezJson.save(db);
    }
    message = JSON.stringify(inactivityList, null, 2);
    let role = interaction.guild.roles.cache.get(roleId);
    if (role) {
      for (const elem of inactivityList) {
        await interaction.guild.members.cache.get(elem.Айди).roles.add(role);
      }
    } else {
      console.error('роль не найдена');
    }
  }
  await interaction.reply(message ? `${message}` : 'Никого нет по данной выборке, роль не была создана');
  ezJson.save(db);
};
