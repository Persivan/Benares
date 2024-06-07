const fs = require('fs');

module.exports = {
  filePath: '',

  // Сохраняет путь до файла, если найдет
  // Принимает путь до файла, относительно вызываемого файла!
  openFile(filePath) {
    if (fs.existsSync(filePath)) {
      this.filePath = filePath;
    } else {
      console.log(`File doesnt exist`);
    }
  },

  // Печатает весь файл
  print() {
    if (this.filePath === '') {
      console.log('openFile first!');
      return;
    }
    const json = require('../' + this.filePath);
    console.log(json);
  },

  // Сохраняет новый обьект и сохраняет
  save(jsonObj) {
    if (!jsonObj) {
      console.log('ТЫ UNDEFINED ЗАКИНУЛ');
      return;
    }
    if (this.filePath === '') {
      console.log('openFile first!');
      return;
    }
    const data = JSON.stringify(jsonObj, null, 2);
    fs.writeFileSync('./db.json', data, err => {
      if (err) {
        throw err;
      }
      console.log('JSON data is saved.');
    });
  },

  // Получить обьект из файла
  getObj() {
    if (this.filePath === '') {
      console.log('openFile first!');
      return;
    }
    const json = require('../' + this.filePath);
    return json;
  },
};
