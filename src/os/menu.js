const { app, BrowserWindow, Menu } = require('electron');
const { SplitCamelCase } = require('../data/helper');
const path = require('path');

var self;
const script = path.parse(__filename).base;

class MenuCreator {
  // Application bar options and functionality.

  constructor(logger, config, store) {
    self = this;
    self.logger = logger;
    self.config = config;
    self.store = store;
    self.logger.log(null, script, "Started!", self.store.user);
  }

  createAppMenu(functions) {
    // Defines the application menu lists and options.
    // - functions: Object containing callback functions to be used by the menu controls.
    self.logger.log(null, script, "---> createAppMenu()");
    self.logger.log(null, script, "functions:", functions);
    let menuTemplate = [
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
        label: 'NPCs',
        submenu: []
      },
      {
        label: 'Vehicles',
        submenu: []
      },
      {
        label: 'Organisations',
        submenu: []
      },
      {
        label: 'World',
        submenu: []
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Open New Window',
            click: async () => {
              self.logger.log(null, script, "View -> Open New Window menu item clicked!");
              functions["newViewFun"]();
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
    let menu = Menu.buildFromTemplate(menuTemplate);
    // Menu.setApplicationMenu(menu);
    Menu.setApplicationMenu(null);
  }

  getContextMenu() {
    // Defines the context menu to be used within the application.
    // let contextTemplate = [
    //   {
    //     label: 'Options',
    //     submenu: [
    //       {
    //         label: 'Test 1',
    //         click: async () => {
    //           self.logger.log(null, script, "Context -> Test1 menu item clicked!");
    //         }
    //       },
    //       {
    //         label: 'Test 2',
    //         click: async () => {
    //           self.logger.log(null, script, "Context -> Test2 menu item clicked!");
    //         }
    //       }
    //     ]
    //   }
    // ]
    // return Menu.buildFromTemplate(contextTemplate);
  }

  handleSetTitle (event, _) {
    // Changes the title of the window that invoked the event.
    // The title describes the current view in the window, plus some additional user information.
    // All relevant information can be retrieved from the Store.
    // console.log("---> handleSetTitle()");
    // Updates the title of the window based on what one is looking on.
    // Template: YADTS Manager / user [role] / {game} category: view
    let title = `YADTS Manager / ${self.store.user.userName} [${self.store.user.userRole}] / {${self.store.user.activeGame}} ${SplitCamelCase(self.store.user.currentView.category)}: ${SplitCamelCase(self.store.user.currentView.view)}`;
    // console.log(title);
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setTitle(title);
  }

}

module.exports = MenuCreator;