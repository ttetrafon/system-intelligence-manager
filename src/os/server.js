const path = require('path');

var self;
const script = path.parse(__filename).base;

class Server {
  // Establishes a game server for other players to connect to this session.

  constructor(logger, config, store) {
    self = this;
    self.logger = logger;
    self.config = config;
    self.store = store;
    self.logger.log(null, script, "Started!");
  }

  // TODO: Clients connected by web-sockets.
  // TODO: On connection, send lists of titles for all entities, so menus are populated accordingly.
  // TODO: Appropriate entity data will be send on request, and kept on the client until the client is closed.
  // TODO: The server needs to keep track of what entities have been passed on clients, so updates propagate accordingly.


}

module.exports = Server;