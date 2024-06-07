const fs = require('fs');
const path = require('path');

function loadConstants(directory) {
  const constants = {};
  const files = fs.readdirSync(directory);

  files.forEach(file => {
    if (file.endsWith('.js')) {
      const constantName = path.basename(file, '.js');
      constants[constantName] = require(path.join(directory, file));
    }
  });

  return constants;
}

module.exports = loadConstants;
