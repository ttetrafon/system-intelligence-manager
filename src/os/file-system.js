// Utility functions for file handling
const { app, dialog } = require('electron');
const { folders } = require('../data/folders');
const fs = require('fs');
const path = require('path');

var self;
const script = path.parse(__filename).base;

class FileSystem {
  // Filesystem control and functionality.

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

    // self.folderStructureStepOne();
  }

  checkIfDirectoryExists(dir) {
    // Checks if a directory exists in the filesystem, and if not it creates it.
    // - dir: The directory in question.
    if (fs.existsSync(dir)) {
      self.logger.log(null, script, "folder found: ", dir);
    }
    else {
      self.logger.log(null, script, "folder not found and has been created: ", dir);
      fs.mkdirSync(dir);
    }
  }

  folderStructureStepOne() {
    // Performs all common folder actions that are needed as soon as the application starts.
    // (1) Locates the user folder.
    // (2) Locates/creates the application save folder.
    // (3) Locates/creates the dictionary folder.
    self.paths.userFolder = app.getPath("documents");
    self.logger.log(null, script, "user folder = ", self.paths.userFolder);

    self.setupDirectory("saveFolder", path.join(self.paths.userFolder, folders.root));
    self.setupDirectory("dictionaries", path.join(self.paths.saveFolder, folders.dictionaries));
    self.logger.log(null, script, "paths (first pass):", self.paths);
  }

  folderStructureStepTwo(selectedGame) {
    // This is called after the first load and the game is selected (in Store.js).
    // It locates/creates the specific game directories required for normal operation.
    self.setupDirectory("gameFolder", path.join(self.paths.saveFolder, selectedGame));
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
    // Reads a specific file from the save directory and returns a json data structure, or 'null' if the file doesn't exist.
    // These files are all data files required by the application.
    // - filepath: The specified filepath.
    self.logger.log(null, script, "---> readJsonFile()", filepath, fs.existsSync(filepath));
    if (!fs.existsSync(filepath)) {
      return null;
    }
    let data = fs.readFileSync(filepath, 'utf8');
    self.logger.log(null, script, filepath, data);
    return JSON.parse(data);
  }

  saveJsonFile(filepath, data) {
    // Saves a json file containing the specified data.
    // - filepath: The full path to save the file.
    // - data: The data to include in the file.
    // console.log("---> saveJsonFile()", filepath, data);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  }

  setupDirectory(name, path) {
    // Checks if a required application directory exists, and if not it creates it.
    self.paths[name] = path;
    self.logger.log(null, script, `${name} folder:`, self.paths[name]);
    self.checkIfDirectoryExists(self.paths[name]);
  }
}

module.exports = FileSystem;