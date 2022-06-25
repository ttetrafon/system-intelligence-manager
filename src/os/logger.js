// System logger.
const { app } = require('electron');
const path = require('path');

var self;
const script = path.parse(__filename).base;

class Logger {
  // Logging functionality to be used by the whole system.
  // (1) Logs directly in the console.
  // TODO: (2) Logs in a log file.
  // TODO: (3) Logs in normal application windows.
  // TODO: Supports info (console.log), warning (console.warn), and error (console.error) logging.

  constructor() {
    self = this;
    self.log(null, script, "Started!");
  }

  log(_, ...args) {
    let script = args.shift();
    console.log(`[${script}]`, ...args);
  }

}

module.exports = Logger;