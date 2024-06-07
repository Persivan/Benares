module.exports = async (message, client, log) => {
  if (message.content === 'test') {
    message
      .reply('tested')
      .then(() => log(`Replied to message "${message.content}" from "${message.author.username}"`))
      .catch(console.error);

    client.users.fetch('295079891055935499', false).then(user => {
      user.send('Test msg ' + message.author.username);
    });
  } else if (message.content === 'бот ливай') {
    message
      .reply('yes, honey')
      .then(() => log(`Replied to message "${message.content}" from "${message.author.username}"`))
      .catch(console.error);

    message.guild
      .leave()
      .then(guild => log(`Left the guild: ${guild.name}`))
      .catch(console.error);
  } else if (message.content === 'del' && message.author.id === '295079891055935499') {
    message.channel.bulkDelete(11);
  }
};
