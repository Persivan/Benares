class myChannel {
  static id = '0';
  static isCreated = Boolean(false);
}

let mainChannel = '884852349745627146';
let mainCategory = '803319900273115146';
let standartName = '[🦴] JoJo Stand';
let channelName = '[🟡] JOJO for ';
let notStandartName = '[🟡] Someone is JoJo [🕜]';

const { ChannelType, PermissionsBitField } = require('discord.js');
module.exports = (oldState, newState) => {
  if (newState.channelId === mainChannel) {
    //No secret channel
    if (!myChannel.isCreated) {
      //Create usernamed channel
      newState.guild.channels
        .create({
          name: channelName + newState.member.user.username,
          type: ChannelType.GuildVoice,
          permissionOverwrites: [
            {
              id: newState.guild.roles.everyone, //To make it be seen by a certain role, user an ID instead
              deny: [new PermissionsBitField().add()], //Deny permission
            },
          ],
          parent: mainCategory,
        })
        .then(chn => {
          //move member
          newState.member.voice.setChannel(chn).catch(console.error);
          myChannel.id = chn.id;
          myChannel.isCreated = true;
        });
      //Rename previous channel
      newState.channel.setName(notStandartName);
    }
    //There is secret channel
    else {
      newState.member.voice.setChannel(myChannel.id).catch(console.error);
    }
  }
  //Secret channel doesn't need anymore or some Alexey moved from secret channel to main
  if (oldState.channelId === myChannel.id && oldState.channel.members.size === 0) {
    if (oldState.channelId === myChannel.id && newState.channelId === mainChannel) {
      newState.member.voice.setChannel(myChannel.id).catch(console.error);
    } else {
      oldState.channel.delete().catch(console.error);
      myChannel.id = '0';
      myChannel.isCreated = false;
      oldState.guild.channels.fetch(mainChannel).then(channel => {
        channel.setName(standartName);
      });
    }
  }
};
