const fs = require("fs");
module.exports = {
    //Возвращает массив имен файлов. Файл с названием README.txt не сохраняет
    //folder - путь до папки 'images/stickers'
    //debug - опциональный параметр, вывод полученного массива строк в консоль
    getFiles: function (folder, debug = 0) {
        //Get all files from folder
        var fs = require("fs");
        var files = fs.readdirSync(folder);

        //deletes files without extension (folders), "README.txt" and ".tmp.drivedownload"
        files = files.filter(
            (a) =>
                a !== "README.txt" &&
                a !== ".tmp.drivedownload" &&
                a !== ".tmp.driveupload" &&
                !fs.lstatSync(folder + a).isDirectory()
        );

        //Debug info
        if (debug) {
            console.log("===Debug getFiles()===");
            console.log(files);
        }

        return files;
    },

    //Получает массив файлов из функции getFiles и возвращает массив комманд сьедобных для дискорда
    //folder - путь до папки 'images/stickers'
    //debug - опциональный параметр, вывод полученного массива строк в консоль
    getCommands: function (folder, debug = 0) {
        var commands = this.getFiles(folder);

        //Generate command from string ----------------------------------------------------------------------------поправить lastindexof на indexof если комманда не может иметь точки (в начале или в середине)
        let unknownCommands = 0;
        commands.forEach((part, index, theArray) => {
            //Delete all after last '.'
            part = part.substring(0, part.lastIndexOf("."));
            //Replace " " to "_"
            part = part.replace(" ", "_");
            //Replace "-" to "_"
            part = part.replace("-", "_");
            //Delete all non number, eng alpabet, "_"
            part = part.replace(/[^0-9a-zA-Z_]/g, "");
            //Lowercase
            part = part.toLowerCase();
            //Delete first numbers
            while (part[0] >= 0 && part[0] <= 9) {
                part = part.substring(1);
            }
            //Create new command for empty
            if (!part) {
                part = "unknown";
            }
            //Add num for same command
            if (!theArray.includes(part.substring(0, 32))) {
                theArray[index] = part.substring(0, 32);
            } else {
                part = part.substring(0, 32 - 1 - unknownCommands.toString.length);
                theArray[index] = part + "_" + unknownCommands++;
            }
        });

        //Debug info
        if (debug) {
            console.log("===Debug getCommands()===");
            console.log(commands);
        }

        return commands;
    },

    // Считает количество строк в файле
    // Принимает путь до файла
    // Возвращает число строк
    countFileLines(filePath) {
        return new Promise((resolve, reject) => {
            let lineCount = 0;
            fs.createReadStream(filePath)
                .on("data", (buffer) => {
                    let idx = -1;
                    lineCount--; // Because the loop will run once for idx=-1
                    do {
                        idx = buffer.indexOf(10, idx + 1);
                        lineCount++;
                    } while (idx !== -1);
                })
                .on("end", () => {
                    console.log(lineCount)
                    resolve(lineCount);
                })
                .on("error", reject);
        });
    }
    /*{
      let i;
      let count = 0;
      require('fs').createReadStream(filePath)
          .on('data', function(chunk) {
            for (i=0; i < chunk.length; ++i)
              if (chunk[i] == 10) count++;
          })
          .on('end', function() {
            console.log(count)
          });
    }*/,

    addProps(obj, arr, val) {
        // Защита от дурака
        if (typeof arr == 'string')
            arr = arr.split(".");

        // Добавляем обьект, если его нет
        obj[arr[0]] = obj[arr[0]] || {};

        let tmpObj = obj[arr[0]];

        if (arr.length > 1) {
            arr.shift();
            this.addProps(tmpObj, arr, val);
        } else obj[arr[0]] = val

        return obj;

    },

    isObjHaveRolesAndUsersArrays(obj, guildId) {
        console.log((Object.hasOwn(obj, guildId) && Object.hasOwn(obj[guildId], 'roles') && Object.hasOwn(obj[guildId], 'users')))
        return (Object.hasOwn(obj, guildId) && Object.hasOwn(obj[guildId], 'roles') && Object.hasOwn(obj[guildId], 'users'));
    }
};
