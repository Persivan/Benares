module.exports = (newState, db, ezJson, Tools) => {
    if (!Tools.isObjHaveRolesAndUsersArrays(db.activity, newState.guild.id)) {
        Tools.addProps(db.activity, `${newState.guild.id}`, {});
        Tools.addProps(db.activity, `${newState.guild.id}.guildName`, newState.guild.name);
        Tools.addProps(db.activity, `${newState.guild.id}.users`, []);
        Tools.addProps(db.activity, `${newState.guild.id}.goodUserRoleId`, "");
        Tools.addProps(db.activity, `${newState.guild.id}.afkUserRoleId`, "");
        Tools.addProps(db.activity, `${newState.guild.id}.autoRoflRole`, false);
        Tools.addProps(db.activity, `${newState.guild.id}.afkRoflRole`, false);
        Tools.addProps(db.activity, `${newState.guild.id}.notExistMeansAfk`, false);
    }
    let index = db.activity[newState.guild.id].users.findIndex((elem) => elem.id === newState.member.user.id)
    if (index !== -1) {
        db.activity[newState.guild.id].users[index].lastVoiceStateUpdateDate = Date.now();
    }
    else {
        db.activity[newState.guild.id].users.push({
            id: newState.member.user.id,
            name: newState.member.user.username,
            lastVoiceStateUpdateDate: Date.now()
        })
    }
    ezJson.save(db);
};


