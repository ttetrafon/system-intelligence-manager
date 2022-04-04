const { app } = require('electron');
const path = require('path');

var self;
const script = path.parse(__filename).base;

class Config {
  constructor(logger) {
    self = this;
    self.logger = logger;
    self.logger.log(null, [script, "Started!"]);
    self.platform = process.platform;
  }

  getPlatform() {
    return self.platform;
  }

  isMac() {
    return self.platform === 'darwin';
  }

}

module.exports = Config;