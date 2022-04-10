const path = require('path');

var self;
const script = path.parse(__filename).base;

class Server {
  constructor(logger, config, store) {
    self = this;
    self.logger = logger;
    self.config = config;
    self.store = store;
    self.logger.log(null, [script, "Started!"]);
  }


}

module.exports = Server;