// All the game data in one place.
const path = require('path');
const Attributes = require('../data/attributes');
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
      checks: null,
      attributes: null
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
    this.loadGameSystemDataFromFile(files.checks, Checks, "checks");
    this.loadGameSystemDataFromFile(files.attributes, Attributes, "attributes");
  }

  loadGameSystemDataFromFile(filename, dataObject, part) {
    // console.log(`---> loadGameSystemDataFromFile(${filename}, ${dataObject}, ${part})`);
    let file = path.join(self.fs.paths.gameSystem, filename);
    let data = self.fs.readJsonFile(file);
    self.gameSystem[part] = new dataObject();
    if (data == null) self.fs.saveJsonFile(file, self.gameSystem[part]);
    else self.gameSystem[part].initialise(data);
    self.storeHash(part, self.gameSystem[part]);
    self.logger.log(null, script, part + ":", self.gameSystem[part]);
  }

  async storeHash(name, value) {
    // console.log(`---> storeHash(${name}, ${JSON.stringify(value)})`);
    self.hashes[name] = GenerateHash(value);
  }

  async updateDictionary(_, part, data) {
    console.log(`---> updateDictionary(${part}, ${JSON.stringify(data)})`);
    // check the hash first, and abort if nothing has changed
    let hash = GenerateHash(data);
    if (self.hashes[part] == hash) return;
    self.dictionaries[part] = data;
    self.hashes[part] = hash;
    self.fs.saveJsonFile(path.join(self.fs.paths.dictionaries, part + ".json"), data);
    // ... and notify all open windows of the info
    self.notifyOpenWindows('updateDictionaries', part, data);
  }

  async updateGameSystem(_, part, data) {
    console.log(`---> updateGameSystem(${part}, ${JSON.stringify(data)})`);
    // check the hash first, and abort if nothing has changed
    let hash = GenerateHash(data);
    if (self.hashes[part] == hash) return;
    // if there was a difference save the new data
    self.gameSystem[part] = data;
    self.hashes[part] = hash;
    self.fs.saveJsonFile(path.join(self.fs.paths.gameSystem, part + ".json"), data);
    // ... and notify all open windows of the info
    self.notifyOpenWindows('updateGameSystem', part, data);
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
    self.hashes.user = hash;
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