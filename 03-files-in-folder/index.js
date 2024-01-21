const promises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const targetFolder = path.join(__dirname, 'secret-folder');

const secretDirArray = promises.readdir(targetFolder);
secretDirArray.then(
  (result) => {
    result.forEach((file) => {
      let filePath = path.join(targetFolder, file);
      fs.stat(filePath, (err, res) => {
        if (err) throw Error;
        if (!res.isDirectory())
          console.log(
            `${path.parse(filePath).name} - ${path
              .extname(filePath)
              .slice(1)} - ${res.size}kb`,
          );
      });
    });
  },
  (error) => console.log(error),
);
