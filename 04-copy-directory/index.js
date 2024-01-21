const fs = require('fs');
const { mkdir } = require('node:fs/promises');
const { join } = require('node:path');
const fsPromises = require('node:fs/promises');

const projectFolderCopy = join(__dirname, 'files-copy');
const projectFolder = join(__dirname, 'files');

function copyDir() {
  function copyFiles() {
    fs.readdir(projectFolder, (error, files) => {
      if (error) throw error;
      files.forEach((file) => {
        const projectFile = join(projectFolder, file);
        const projectFileCopy = join(projectFolderCopy, file);
        fs.promises.copyFile(projectFile, projectFileCopy);
      });
    });
  }
  async function deleteFiles() {
    await fsPromises.rm(projectFolderCopy, {
      recursive: true,
      force: true,
      maxRetries: 100,
    });
    mkdir(projectFolderCopy, { recursive: true });
    copyFiles();
  }

  fs.access(projectFolderCopy, (err) => {
    if (err) {
      mkdir(projectFolderCopy, { recursive: true });
      copyFiles();
    } else {
      deleteFiles();
    }
  });
}
copyDir();
