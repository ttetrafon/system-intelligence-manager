const { app, BrowserWindow, Menu } = require('electron');
var self;
const script = __filename.split('\\').pop();

class MenuCreator {
  constructor(logger, config) {
    self = this;
    self.logger = logger;
    self.config = config;
    self.logger.log(null, script, "Started!");

    self.menuTemplate = [
      ...(self.config.isMac() ? [{
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }] : []),
      {
        label: 'File',
        submenu: [
          {
            label: 'Open File',
            click: async () => {
              self.logger.log(null, script, "File -> Open File menu item clicked!");
            }
          },
          { type: 'separator' },
          { role: 'minimize' },
          { role: 'close' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      {
        label: 'Server',
        submenu: [
          {
            label: 'Start Server',
            click: async () => {
              self.logger.log(null, script, "Server -> Start Server menu item clicked!");
            }
          },
          {
            label: 'Stop Server',
            click: async () => {
              self.logger.log(null, script, "Server -> Stop Server menu item clicked!");
            }
          },
          { type: 'separator' },
          {
            label: 'Connect to Server',
            click: async () => {
              self.logger.log(null, script, "Server -> Connect to Server menu item clicked!");
            }
          },
          {
            label: 'Disconnect from Server',
            click: async () => {
              self.logger.log(null, script, "Server -> Disconnect from Server menu item clicked!");
            }
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'copy' },
          { role: 'cut' },
          { role: 'paste' },
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ]
      },
      {
        label: 'Game System',
        submenu: []
      },
      {
        label: 'World',
        submenu: []
      },
      {
        label: 'Creatures',
        submenu: []
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Open New Window',
            click: async () => {
              self.logger.log(null, script, "View -> Open New Window menu item clicked!");
            },
            accelerator: 'CmdOrCtrl+N'
          },
          { type: 'separator' },
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'toggleFullScreen' }
        ]
      }
    ];

    self.contextTemplate = [
      {
        label: 'Options',
        submenu: [
          {
            label: 'Test 1',
            click: async () => {
              self.logger.log(null, script, "Context -> Test1 menu item clicked!");
            }
          },
          {
            label: 'Test 2',
            click: async () => {
              self.logger.log(null, script, "Context -> Test2 menu item clicked!");
            }
          }
        ]
      }
    ]
  }

  createAppMenu() {
    let menu = Menu.buildFromTemplate(self.menuTemplate);
    Menu.setApplicationMenu(menu);
  }

  getContextMenu() {
    return Menu.buildFromTemplate(self.contextTemplate);
  }

  handleSetTitle (event, title) {
    // Updates the title of the window based on what one is looking on.
    // Template: YADTS Manager - Campaign [player] - 'current view'
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setTitle(title);
  }

}

module.exports = MenuCreator;