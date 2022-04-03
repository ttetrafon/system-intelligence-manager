// System logger.
const { app } = require('electron');

var self;
const script = __filename.split('\\').pop();

class Logger {
  constructor() {
    self = this;
    self.log(null, [script, "Started!"]);
  }

  log(event, args) {
    console.log(...args);
  }

}

module.exports = Logger;