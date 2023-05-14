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
  // Holds the active state of the main process, and provides functionality around it.

  constructor(logger, config, fileSystem, notifyOpenWindows) {
    self = this;
    self.logger = logger;
    self.config = config;
    self.fs = fileSystem;
    self.notifyOpenWindows = notifyOpenWindows;
    self.logger.log(null, script, "Started!");

    // Store hashes to control saving/sending over the network, as well as limiting saving data on the disk without the need to do so.
    self.hashes = {};

    // Objects that hold all information required by the application and the selected game.
    self.user = null;
    self.dictionaries = {
      names: {}
    };
    self.gameSystem = {
      checks: null,
      attributes: null
    };

    // Load all required data from the disk during startup.
    // self.initialPreparation();
    // self.loadDictionaries();
    // self.loadGameSystem();
  }

  initialPreparation() {
    // Loads all common data required for normal operation.
    let userFile = path.join(self.fs.paths.saveFolder, files.user);
    let data = self.fs.readJsonFile(userFile);
    self.user = new User();
    if (data == null) self.fs.saveJsonFile(userFile, self.user);
    else self.user.initialiseUser(data);
    self.storeHash("user", self.user);
    self.logger.log(null, script, "user:", self.user);
  }

  loadDictionaries() {
    // Loads all dictionaries, which are common between different games.
    let namesDict = path.join(self.fs.paths.dictionaries, files.dictionaryNames);
    let namesData = self.fs.readJsonFile(namesDict);
    if (namesData == null) self.fs.saveJsonFile(namesDict, self.dictionaries.names);
    else self.dictionaries.names = namesData;
    this.storeHash("names", self.dictionaries.names);
    self.logger.log(null, script, "dictionaries:", self.dictionaries);
  }

  loadGameSystem() {
    // Loads all game system relevant information.
    self.fs.folderStructureStepTwo(self.user.activeGame);
    this.loadGameSystemDataFromFile(files.checks, Checks, "checks");
    this.loadGameSystemDataFromFile(files.attributes, Attributes, "attributes");
  }

  loadGameSystemDataFromFile(filename, dataObject, part) {
    // Loads game system data from a specific file.
    // If the file does not exist, the data are initialised with default values and the file is saved with these.
    console.log(`---> loadGameSystemDataFromFile(${filename}, ${dataObject}, ${part})`);
    let file = path.join(self.fs.paths.gameSystem, filename);
    let data = self.fs.readJsonFile(file);
    self.gameSystem[part] = new dataObject();
    if (data == null) self.fs.saveJsonFile(file, self.gameSystem[part]);
    else self.gameSystem[part].initialise(data);
    self.storeHash(part, self.gameSystem[part]);
    self.logger.log(null, script, part + ":", self.gameSystem[part]);
  }

  async storeHash(name, value) {
    // Stores a specific object's hash under the object's name.
    // - name: The name with which the object is known in the store.
    // - value: The hash value.
    // console.log(`---> storeHash(${name}, ${JSON.stringify(value)})`);
    self.hashes[name] = GenerateHash(value);
  }

  async updateDictionary(_, part, data) {
    // Updates a specified dictionary with the provided data, stores it on the disk,
    // and notifies all open windows for the update.
    // Also used to add data to a dictionary.
    // - part: The dictionary to be updated. These are the keys under `this.dictionaries`.
    // - data: The updated data structure.
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
    // Updates a specific game system data structure with new/updated information, stores it on the disk,
    // and notifies all open windows for the update.
    // - part: The key under `this.gameSystem` to be updated.
    // - data: The updated data.
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
    // Updates the User data object and saves the new information on the disk.
    // - user: The updated user data structure.
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