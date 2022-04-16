const { app, BrowserWindow, dialog, ipcMain, Notification } = require('electron');

const isDev = (process.env.NODE_ENV == 'dev');

// This actively reloads the view when the code changes!
// Will also reload the whole app when backend files are changed, but console logs are lost.
if (isDev) {
  try { require('electron-reloader')(module); } catch(exc) {}
}

const { on } = require('events');
const { palette } = require('./data/colours');
const path = require('path');
const Config = require('./os/config');
const FileSystem = require('./os/file-system');
const Logger = require('./os/logger');
const MenuCreator = require('./os/menu');
const Server = require('./os/server');
const Store = require('./store');

const script = path.parse(__filename).base;
const logger = new Logger();
const config = new Config(logger);
const fs = new FileSystem(logger);
const menu = new MenuCreator(logger, config);
const store = new Store(logger, config, fs);
const server = new Server(logger, config, store);

logger.log(null, [script, "Started!", process.env, process.env.NODE_ENV, isDev]);

const createWindow = () => {
  const win = new BrowserWindow({
    show: false,
    width: 1024,
    minWidth: 800,
    height: 768,
    minHeight: 600,
    backgroundColor: palette["background-light"],
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'os/preload.js')
    },
    // icon: path.join(__dirname, 'resources/Unmarked Die.jpg')
    icon: path.join(__dirname, 'resources/Notepad 1.png')
  });

  win.loadFile('./src/views/index.html');
  win.webContents.on('context-menu', () => {
    menu.getContextMenu().popup(win.webContents);
  });

  win.once('ready-to-show', () => { win.show(); });
  if (isDev) {
    win.webContents.openDevTools();
  }
}

const createLinkWindow = (event, url) => {
  logger.log(null, [script, "---> createLinkWindow()", url]);
  const link = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'resources/Connect 1.png')
  });
  link.setMenuBarVisibility(false);

  link.loadURL(url);
  link.once('ready-to-show', () => { link.show(); });
}

menu.createAppMenu({
  "newViewFun": createWindow
});

const handleError = (message) => {
  new Notification({
    title: "Error",
    body: message
  }).show();
};

app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', fs.handleFileOpen);
  ipcMain.on('set-title', menu.handleSetTitle);
  ipcMain.on('log', logger.log);
  ipcMain.on('open-link', createLinkWindow)
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
