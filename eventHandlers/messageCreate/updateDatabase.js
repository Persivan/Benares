module.exports = (message, db, ezJson, Tools) => {
    if (!Tools.isObjHaveRolesAndUsersArrays(db.activity, message.guildId)) {
        Tools.addProps(db.activity, `${message.guildId}`, {});
        Tools.addProps(db.activity, `${message.guildId}.guildName`, message.guild.name);
        Tools.addProps(db.activity, `${message.guildId}.users`, []);
        Tools.addProps(db.activity, `${message.guildId}.goodUserRoleId`, "");
        Tools.addProps(db.activity, `${message.guildId}.afkUserRoleId`, "");
        Tools.addProps(db.activity, `${message.guildId}.autoRoflRole`, false);
        Tools.addProps(db.activity, `${message.guildId}.afkRoflRole`, false);
        Tools.addProps(db.activity, `${message.guildId}.notExistMeansAfk`, false);
    }

    let index = db.activity[message.guildId].users.findIndex((elem) => elem.id === message.author.id);
    if (index !== -1) {
        db.activity[message.guildId].users[index].lastMessageDate = Date.now();
    } else {
        db.activity[message.guildId].users.push({
            id: message.author.id,
            name: message.author.username,
            lastMessageDate: Date.now()
        });
    }
    ezJson.save(db);
};
