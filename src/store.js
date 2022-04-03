// All the game data in one place.
const { userInfo } = require('os');
const path = require('path');
const User = require('./data/user');

var self;
const script = __filename.split('\\').pop();

class Store {
  constructor(logger, config, fileSystem) {
    self = this;
    self.logger = logger;
    self.config = config;
    self.fs = fileSystem;
    self.logger.log(null, [script, "Started!"]);

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
    self.logger.log(null, [script, "user:", self.user]);
  }
};

module.exports = Store;