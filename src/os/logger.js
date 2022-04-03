// System logger.
const { app } = require('electron');

var self;
const script = __filename.split('\\').pop();

class Logger {
  constructor() {
    self = this;
    self.log(null, script, "Started!");
  }

  log(event, source, message) {
    console.log("[" + source + "] " + message);
  }

}

module.exports = Logger;