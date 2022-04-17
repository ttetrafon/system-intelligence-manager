// All the game data in one place.
const path = require('path');
const User = require('./data/user');

const { GenerateHash } = require('./data/helper');

var self;
const script = path.parse(__filename).base;

class Store {
  constructor(logger, config, fileSystem) {
    self = this;
    self.logger = logger;
    self.config = config;
    self.fs = fileSystem;
    self.logger.log(null, [script, "Started!"]);

    // store hashes to control saving/sending over the network
    self.hashes = {
      user: ""
    };

    self.user = null;

    self.initialPreparation();
  }

  initialPreparation() {
    let userFile = path.join(self.fs.saveFolder, "User.json");
    let data = self.fs.readJsonFile(userFile);
    let user = new User();
    if (data == null) {
      self.fs.saveJsonFile(userFile, user);
    }
    else {
      user.initialiseUser(data);
    }
    self.user = user;
    this.storeHash("user", self.user);
    self.logger.log(null, [script, "user:", self.user]);
  }

  async storeHash(name, value) {
    console.log(`---> storeHash(${name}, ${JSON.stringify(value)})`);
    self.hashes[name] = GenerateHash(value);
    self.logger.log(null, [script, "hashes", self.hashes]);
  }

};

module.exports = Store;