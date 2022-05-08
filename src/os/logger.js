// System logger.
const { app } = require('electron');
const path = require('path');

var self;
const script = path.parse(__filename).base;

class Logger {
  constructor() {
    self = this;
    self.log(null, script, "Started!");
  }

  log(_, ...args) {
    let script = args.shift();
    console.log(`[${script}]`, ...args);
    // TODO: add an extra argument for log level (or create different functions) and log stuff depending on the log level selected by the user.
    // TODO: log events in a file also
  }

}

module.exports = Logger;