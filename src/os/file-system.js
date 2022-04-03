// Utility functions for file handling
const { app, dialog } = require('electron');
const { folders } = require('../data/folders');
const fs = require('fs');
const path = require('path');

var self;
const script = __filename.split('\\').pop();

class FileSystem {
  constructor(logger) {
    self = this;
    self.logger = logger;
    self.logger.log(null, [script, "Started!"]);

    self.userFolder = app.getPath("documents");
    self.logger.log(null, [script, "user folder = ", self.userFolder]);

    self.saveFolder = path.join(self.userFolder, folders["root"]);
    self.checkIfDirectoryExists(self.saveFolder);
    self.logger.log(null, [script, "save folder = ", self.saveFolder]);
  }

  checkIfDirectoryExists(dir) {
    if (fs.existsSync(dir)) {
      self.logger.log(script, ["folder found: ", dir]);
    }
    else {
      self.logger.log(script, ["folder not found: ", dir]);
      fs.mkdirSync(dir);
    }
  }

  async handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog();
    if (canceled) {
      return;
    } else {
      return filePaths[0];
    }
  }

  readJsonFile(filepath) {
    self.logger.log(null, [script, "---> readJsonFile()", filepath, fs.existsSync(filepath)]);
    if (!fs.existsSync(filepath)) {
      return null;
    }
    let data = fs.readFileSync(filepath, 'utf8');
    self.logger.log(null, [script, filepath, data]);
    return JSON.parse(data);
  }

  saveJsonFile(filepath, data) {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  }

}

module.exports = FileSystem;