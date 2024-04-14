module.exports = (client, db, config) => {
        // Забрать роль успешного человека
        console.log('[roles] Забираю роль');
        client.guilds.cache.forEach((guild) => {
            console.log('[roles] Нашелся сервер: ', guild.name);

            // Если в конфиге нет роли ничего не делаем
            if (!db.activity[guild.id]) {
                console.log('[roles] Сервера нет в бд');
                return;
            }
            if (!db.activity[guild.id].afkUserRoleId) {
                console.log('[roles] Нет роли для выдачи афк');
                return;
            }
            if (!db.activity[guild.id].goodUserRoleId) {
                console.log('[roles] Нет роли для выдачи хорошей');
                return;
            }
            // Если в конфиге стоит не использовать функционал, ничего не делаем
            let afkRoflRole = config.guilds.some((elem) => elem.id === guild.id && elem.afkRoflRole)
            let autoRoflRole = config.guilds.some((elem) => elem.id === guild.id && elem.autoRoflRole)
            let notExistMeansAfk = config.guilds.some((elem) => elem.id === guild.id && elem.notExistMeansAfk) // Если чела нет в бд, значит он афк
            if (!afkRoflRole && !autoRoflRole) return;

            // Получаем обьект роли
            console.log('[roles] Роль: ' + db.activity[guild.id].goodUserRoleId);
            let roleGood = guild.roles.cache.get(db.activity[guild.id].goodUserRoleId);
            let roleBad = guild.roles.cache.get(db.activity[guild.id].afkUserRoleId);

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

                        // Если чела нет в бд и сервер не должен выдавать роль афк для несуществующих челов
                        if (index === -1) {
                            console.log('[roles] чела нет в бд: ', member.user.id, ' ник: ', member.user.globalName)
                            if (notExistMeansAfk) {
                                member.roles.add(roleBad)
                                    .then(() => console.log('[roles] afkRoflRole Чела нет в бд. Роль успешно добавлена: ', member.user.id, ' ник: ', member.user.globalName))
                                    .catch(() => console.log('[roles] afkRoflRole Чела нет в бд. Ошибка при добавление: ', member.user.id, ' ник: ', member.user.globalName))
                            }
                            return
                        }

                        // Получаем время инактива
                        let date1 = Math.floor(db.activity[guild.id].users[index].lastMessageDate / (1000 * 60 * 60 * 24));
                        let date2 = Math.floor(db.activity[guild.id].users[index].lastVoiceStateUpdateDate / (1000 * 60 * 60 * 24));
                        let currentDate = Math.floor(Date.now() / (1000 * 60 * 60 * 24));

                        // Если чел существует в бд и он не был активен более 14 дней
                        if ((date2 && currentDate - date2 < 14) && (date1 && currentDate - date1 < 14)) {
                            if (autoRoflRole)
                                member.roles.add(roleGood)
                                    .then(() => console.log('[roles] autoRoflRole Роль успешно добавлена: ', member.user.id, ' ник: ', member.user.globalName))
                                    .catch(() => console.log('[roles] autoRoflRole Ошибка при выдаче роли: ', member.user.id, ' ник: ', member.user.globalName))
                            if (afkRoflRole)
                                member.roles.remove(roleBad)
                                    .then(() => console.log('[roles] afkRoflRole Роль успешно удалена: ', member.user.id, ' ник: ', member.user.globalName))
                                    .catch(() => console.log('[roles] afkRoflRole Ошибка при удаление: ', member.user.id, ' ник: ', member.user.globalName))
                        }
                        else {
                            if (autoRoflRole)
                                member.roles.remove(roleGood)
                                    .then(() => console.log('[roles] autoRoflRole Роль успешно удалена: ', member.user.id, ' ник: ', member.user.globalName))
                                    .catch(() => console.log('[roles] autoRoflRole Ошибка при удаление: ', member.user.id, ' ник: ', member.user.globalName))
                            if (afkRoflRole)
                                member.roles.add(roleBad)
                                    .then(() => console.log('[roles] afkRoflRole Роль успешно добавлена: ', member.user.id, ' ник: ', member.user.globalName))
                                    .catch(() => console.log('[roles] afkRoflRole Ошибка при добавление: ', member.user.id, ' ник: ', member.user.globalName))
                        }

                        if (notExistMeansAfk && !date2 && !date1) {
                            if (autoRoflRole)
                                member.roles.remove(roleGood)
                                    .then(() => console.log('[roles] autoRoflRole Роль успешно удалена: ', member.user.id, ' ник: ', member.user.globalName))
                                    .catch(() => console.log('[roles] autoRoflRole Ошибка при удаление: ', member.user.id, ' ник: ', member.user.globalName))
                            if (afkRoflRole)
                                member.roles.add(roleBad)
                                    .then(() => console.log('[roles] afkRoflRole Роль успешно добавлена: ', member.user.id, ' ник: ', member.user.globalName))
                                    .catch(() => console.log('[roles] afkRoflRole Ошибка при добавление: ', member.user.id, ' ник: ', member.user.globalName))
                        }
                    })
                })
        })
        console.log('[roles] Закончил выдачу рофлокек ролей')
};