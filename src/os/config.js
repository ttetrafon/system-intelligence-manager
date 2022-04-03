const { app } = require('electron');
var self;
const script = __filename.split('\\').pop();

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