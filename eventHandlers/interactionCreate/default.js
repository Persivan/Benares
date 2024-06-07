module.exports = async (interaction, fs, config, Tools) => {
    const folder = config.folders.stickers;
    let files = Tools.getFiles(folder, 0);
    let commands = Tools.getCommands(folder, 1);
    let flag = 0;
    for (let i = 0; i < commands.length; i++) {
        if (interaction.commandName === commands[i]) {
            if (fs.statSync(folder + files[i]).size <= 8387584) {
                await interaction.reply({ files: [folder + files[i]] });
                flag = 1;
            } else {
                await interaction.reply({
                    files: [config.folders.images + "too_big.png"],
                });
                flag = 1;
            }
        }
    }
    if (!flag) {
        await interaction.reply({
            files: [config.folders.images + "unknown_command.png"],
        });
    }
};
