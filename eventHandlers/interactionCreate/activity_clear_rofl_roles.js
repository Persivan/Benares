module.exports = async (interaction, ezJson, db) => {
    if (interaction.user.id !== '295079891055935499') {
        interaction.reply('У вас нет прав');
        return;
    }

    let roleManager = interaction.guild.roles;
    for (const elem of db.activity[interaction.guildId].roles) {
        await roleManager.delete(elem.id);
    }
    db.activity[interaction.guildId].roles = [];
    ezJson.save(db);
    interaction.reply('Удалены все "неактивные" роли');
};
