// System logger.
var self;
const script = __filename.split('\\').pop();

class Logger {
  constructor() {
    self = this;
    self.log(null, script, "Started!");
  }

  log(event, script, message) {
    console.log("[" + script + "] " + message);
  }

}

module.exports = Logger;