// All the game data in one place.
const path = require('path');
const Checks = require('../data/checks');
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
    self.gameSystem = {
      checks: null
    };

    self.initialPreparation();
    self.loadDictionaries();
    self.loadGameSystem();
  }

  initialPreparation() {
    let userFile = path.join(self.fs.paths.saveFolder, files.user);
    let data = self.fs.readJsonFile(userFile);
    self.user = new User();
    if (data == null) self.fs.saveJsonFile(userFile, self.user);
    else self.user.initialiseUser(data);
    self.storeHash("user", self.user);
    self.logger.log(null, script, "user:", self.user);
  }

  loadDictionaries() {
    let namesDict = path.join(self.fs.paths.dictionaries, files.dictionaryNames);
    let namesData = self.fs.readJsonFile(namesDict);
    if (namesData == null) self.fs.saveJsonFile(namesDict, self.dictionaries.names);
    else self.dictionaries.names = namesData;
    this.storeHash("names", self.dictionaries.names);
    self.logger.log(null, script, "dictionaries:", self.dictionaries);
  }

  loadGameSystem() {
    self.fs.folderStructureStepTwo(self.user.activeGame);

    let checksFile = path.join(self.fs.paths.gameSystem, files.checks);
    let checksData = self.fs.readJsonFile(checksFile);
    self.gameSystem.checks = new Checks();
    if (checksData == null) self.fs.saveJsonFile(checksFile, self.gameSystem.checks);
    else self.gameSystem.checks.initialiseChecks(checksData);
    console.log("... initialised checks:", self.gameSystem.checks);
    self.storeHash("checks", self.gameSystem.checks);
    self.logger.log(null, script, "checks:", self.gameSystem.checks);
  }

  async storeHash(name, value) {
    console.log(`---> storeHash(${name}, ${JSON.stringify(value)})`);
    self.hashes[name] = GenerateHash(value);
  }

  async updateUser(_, user) {
    // console.log("---> updateUser()", user);
    // check the hash first, and abort if nothing has changed
    let hash = GenerateHash(user);
    if (self.hashes.user == hash) return;
    // remember if the game changed, so the new game folders are loaded
    let gameChanged = (user.activeGame !== self.user.activeGame);
    // if there was a difference save the new data
    self.user = user;
    self.storeHash("user", self.user);
    self.fs.saveJsonFile(path.join(self.fs.paths.saveFolder, files.user), user);
    // ... and notify all open windows of the new user info
    self.notifyOpenWindows('updateUser', user);
    // ... and if the game changed, about the new game data
    if (gameChanged) {
      self.loadGameSystem();
      // TODO: send data to all windows
    }
  }

};

module.exports = Store;