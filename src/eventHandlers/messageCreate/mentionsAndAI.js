module.exports = async (message, client, log, Tools, openai, config) => {
  if (message.mentions.has(client.user)) {
    if (message.author.id === '295079891055935499') {
      message.channel
        .send({
          content: `Yes, my master? https://www.youtube.com/watch?v=3M3x4rsyd84`,
        })
        .catch(console.error);
      return;
    }
    let filePath = './index.js';
    let count = 0;
    await Tools.countFileLines(filePath)
      .then(x => {
        count = x;
      })
      .catch(() => {
        log(`Error in countFileLines with path \"${filePath}\"`);
        count = '**_more than 1? I guess... sorry there is error)_**';
      });
    message.channel
      .send({
        content: `I have ${count} lines of code, don't touch me... HELP! <@!295079891055935499> `,
        files: [config.folders.images + '/help.png'],
      })
      .then(() => log(`Send message on "${message.content}" from "${message.author.username}"`))
      .catch(console.error);
    return;
  }

  if (message.channelId === '1062427808091099266' || message.channelId === '1156308603343483010') {
    let msg = message.content;
    if (msg.startsWith('//') || msg === '') return;
    let currDate = new Date().toLocaleDateString();
    let currTime = new Date().toLocaleTimeString();
    log(`messageCreate - openAI message: "${msg}"; name = ${message.author.username}`);
    await openai.chat.completions
      .create({
        messages: [{ role: 'user', content: msg }],
        model: 'gpt-5-nano',
      })
      .then(async result => {
        log(result.choices[0].message);
        await message
          .reply(result.choices[0].message.content)
          .catch(async er => await message.reply('Something went wrong (скорее всего размер сообщения от бота более 2000 символов)'));
      })
      .catch(async err => {
        log(err);
        try {
          await message.reply('Something went wrong(( ' + err.response.status + ': ' + err.response.statusText);
        } catch (e) {
          log(e);
        }
      });
  }
};
