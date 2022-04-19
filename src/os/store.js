// All the game data in one place.
const path = require('path');
const User = require('../data/user');

const { GenerateHash } = require('../data/helper');
const { files } = require('../data/files');

var self;
const script = path.parse(__filename).base;

class Store {
  constructor(logger, config, fileSystem, notifyOpenWindows) {
    self = this;
    self.logger = logger;
    self.config = config;
    self.fs = fileSystem;
    self.notifyOpenWindows = notifyOpenWindows;
    self.logger.log(null, script, "Started!");

    // store hashes to control saving/sending over the network
    self.hashes = {};

    self.user = null;
    self.dictionaries = {
      names: {}
    };

    self.initialPreparation();
    self.fs.folderStructureStepTwo(self.user.activeGame);
    // self.loadDictionaries();
    // self.loadGameSystem();
  }

  initialPreparation() {
    let userFile = path.join(self.fs.paths.saveFolder, files.user);
    let data = self.fs.readJsonFile(userFile);
    let user = new User();
    if (data == null) self.fs.saveJsonFile(userFile, user);
    else user.initialiseUser(data);
    self.user = user;
    this.storeHash("user", self.user);
    self.logger.log(null, script, "user:", self.user);
  }

  loadDictionaries() {
    let namesDict = path.join(self.fs.paths.dictionaries, files.dictionaryNames);
    let data = self.fs.readJsonFile(namesDict);
    if (data == null) self.fs.saveJsonFile(namesDict, self.dictionaries.names);
    else self.dictionaries.names = data;
    this.storeHash("names", self.dictionaries.names);
    self.logger.log(null, script, "dictionaries:", self.dictionaries);
  }

  loadGameSystem() {

  }

  async storeHash(name, value) {
    console.log(`---> storeHash(${name}, ${JSON.stringify(value)})`);
    self.hashes[name] = GenerateHash(value);
  }

  async updateUser(_, user) {
    console.log("---> updateUser()", user);
    // check the hash first, and abort if nothing has changed
    let hash = GenerateHash(user);
    if (self.hashes.user == hash) return;
    // if there was a difference save the new data
    self.user = user;
    self.fs.saveJsonFile(path.join(self.fs.paths.saveFolder, files.user), user);
    // ... and notify all open windows
    self.notifyOpenWindows('updateUser', user);
  }

};

module.exports = Store;