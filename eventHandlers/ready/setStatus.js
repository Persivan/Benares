const { ActivityType } = require('discord-api-types/v10');
module.exports = (client, constants) => {
  // Define activity types
  const activityTypes = [
    { type: ActivityType.Playing, list: constants.games },
    {
      type: ActivityType.Streaming,
      list: constants.music.concat(constants.video),
    },
    { type: ActivityType.Custom, list: constants.status },
  ];

  // Generate random type
  const randomType = Math.floor(Math.random() * activityTypes.length);

  // Generate random index
  const randomIndex = Math.floor(Math.random() * activityTypes[randomType].list.length);

  // Set activity
  const activity = activityTypes[randomType];

  client.user.setActivity({
    name: activity.type === ActivityType.Streaming ? activity.list[randomIndex][0] : activity.list[randomIndex],
    type: activity.type,
    ...(activity.type === ActivityType.Streaming && {
      url: activity.list[randomIndex][1],
    }),
  });
};
