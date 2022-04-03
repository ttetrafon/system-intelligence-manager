// Utility functions for file handling
const { dialog } = require('electron');

var self;
const script = __filename.split('\\').pop();

class FileSystem {
  constructor(logger) {
    self = this;
    self.logger = logger;
    self.logger.log(null, [script, "Started!"]);
  }

  async handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog();
    if (canceled) {
      return;
    } else {
      return filePaths[0];
    }
  }

}

module.exports = FileSystem;