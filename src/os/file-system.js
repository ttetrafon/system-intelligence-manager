// Utility functions for file handling
var self
const script = __filename.split('\\').pop();

class FileSystem {
  constructor(logger) {
    self = this;
    self.logger = logger;
    self.logger.log(null, script, "Started!");
  }

}

module.exports = FileSystem;