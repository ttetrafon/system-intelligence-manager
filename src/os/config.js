const { app } = require('electron');
const path = require('path');

var self;
const script = path.parse(__filename).base;

class Config {
  // Configuration controls and functionality.

  constructor(logger) {
    self = this;
    self.logger = logger;
    self.logger.log(null, script, "Started!");
    self.platform = process.platform;
  }

  getPlatform() {
    // Returns the platform name the application currently runs on.
    return self.platform;
  }

  isMac() {
    // Returns true if the platform the application is a mac.
    // Needed for controlling how some specific things work on a mac differently than on windows or linus.
    return self.platform === 'darwin';
  }

}

module.exports = Config;