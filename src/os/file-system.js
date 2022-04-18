// Utility functions for file handling
const { app, dialog } = require('electron');
const { folders } = require('../data/folders');
const fs = require('fs');
const path = require('path');

var self;
const script = path.parse(__filename).base;

class FileSystem {
  constructor(logger) {
    self = this;
    self.logger = logger;
    self.logger.log(null, script, "Started!");

    self.paths = {
      dictionaries: null,
      gameFolder: null,
      gameSystem: null,
      saveFolder: null,
      userFolder: null
    };

    self.folderStructureStepOne();
  }

  checkIfDirectoryExists(dir) {
    if (fs.existsSync(dir)) {
      self.logger.log(null, script, "folder found: ", dir);
    }
    else {
      self.logger.log(null, script, "folder not found and has been created: ", dir);
      fs.mkdirSync(dir);
    }
  }

  folderStructureStepOne() {
    self.paths.userFolder = app.getPath("documents");
    self.logger.log(null, script, "user folder = ", self.paths.userFolder);

    self.setupDirectory("saveFolder", path.join(self.paths.userFolder, folders.root));
    self.logger.log(null, script, "paths (first pass):", self.paths);
  }

  folderStructureStepTwo(selectedGame) {
    self.setupDirectory("gameFolder", path.join(self.paths.saveFolder, selectedGame));
    self.setupDirectory("dictionaries", path.join(self.paths.gameFolder, folders.dictionaries));
    self.setupDirectory("gameSystem", path.join(self.paths.gameFolder, folders.gameSystem));
    self.logger.log(null, script, "paths (second pass):", self.paths);
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
    self.logger.log(null, script, "---> readJsonFile()", filepath, fs.existsSync(filepath));
    if (!fs.existsSync(filepath)) {
      return null;
    }
    let data = fs.readFileSync(filepath, 'utf8');
    self.logger.log(null, script, filepath, data);
    return JSON.parse(data);
  }

  saveJsonFile(filepath, data) {
    // console.log("---> saveJsonFile()", filepath, data);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  }

  setupDirectory(name, path) {
    self.paths[name] = path;
    self.logger.log(null, script, `${name} folder:`, self.paths[name]);
    self.checkIfDirectoryExists(self.paths[name]);
  }
}

module.exports = FileSystem;