// System logger.
const { app } = require('electron');
const path = require('path');

var self;
const script = path.parse(__filename).base;

class Logger {
  constructor() {
    self = this;
    self.log(null, [script, "Started!"]);
  }

  log(_, args) {
    console.log(...args);
  }

}

module.exports = Logger;