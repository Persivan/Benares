module.exports = (client, db, config) => {
        // Забрать роль успешного человека
        console.log('[roles] Забираю роль');
        client.guilds.cache.forEach((guild) => {
            console.log('[roles] Нашелся сервер: ', guild.name);

            // Если в конфиге нет роли ничего не делаем
            console.log(guild.id)
            console.log(db.activity[guild.id])
            if (!db.activity[guild.id] || !db.activity[guild.id].goodUserRoleId) {
                console.log('[roles] На сервере еще нет роли для рофлокеков, создайте ее и запишите roleId в базу');
                return;
            }
            // Если в конфиге стоит не использовать функционал, ничего не делаем
            if (!config.guilds.some((elem) => elem.id === guild.id && elem.autoRoflRole)) return;

            // Получаем обьект роли
            console.log('[roles] Роль: ' + db.activity[guild.id].goodUserRoleId);
            let role = guild.roles.cache.get(db.activity[guild.id].goodUserRoleId);

            // Получаем список юзеров
            guild.members.fetch()
                .then((list) => {
                    let guildMembersCount = null;
                    list.tap(coll => {
                        console.log('[roles] Всего пользователей: ' + coll.size);
                        guildMembersCount = coll.size;
                    });

                    list.forEach((member) => {
                        // Получаем индекс из БД
                        let inActive = false;
                        index = db.activity[guild.id].users.findIndex((elem) => elem.id === member.user.id)

                        if (index === -1) {
                            console.log('[roles] чела нет в бд: ', member.user.id, ' ник: ', member.user.globalName)
                            return
                        }

                        // Получаем время инактива
                        let date1 = Math.floor(db.activity[guild.id].users[index].lastMessageDate / (1000 * 60 * 60 * 24));
                        let date2 = Math.floor(db.activity[guild.id].users[index].lastVoiceStateUpdateDate / (1000 * 60 * 60 * 24));
                        let currentDate = Math.floor(Date.now() / (1000 * 60 * 60 * 24));

                        // Если чел существует в бд и он не был активен более 14 дней, то забираем у него роль
                        if ((date2 && currentDate - date2 > 14) && (date1 && currentDate - date2 > 14)) {
                            member.roles.remove(role)
                                .then(() => console.log('[roles] Роль успешно удалена: ', member.user.id, ' ник: ', member.user.globalName))
                                .catch(() => console.log('[roles] Ошибка при удаление: ', member.user.id, ' ник: ', member.user.globalName))
                        } 
                        else {
                            member.roles.add(role)
                                .then(() => console.log('[roles] Роль успешно добавлена: ', member.user.id, ' ник: ', member.user.globalName))
                                .catch(() => console.log('[roles] Ошибка при выдаче роли: ', member.user.id, ' ник: ', member.user.globalName))
                        } 
                    })
                })
        })
        console.log('[roles] Закончил выдачу рофлокек ролей')
};