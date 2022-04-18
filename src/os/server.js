const path = require('path');

var self;
const script = path.parse(__filename).base;

class Server {
  constructor(logger, config, store) {
    self = this;
    self.logger = logger;
    self.config = config;
    self.store = store;
    self.logger.log(null, script, "Started!");
  }

  // When a client connects, send a list of all stored objects alongside their hashes.
  // The client should then return only a list of what has changed during the last connection time,
  // so the server will send only the required information.



}

module.exports = Server;