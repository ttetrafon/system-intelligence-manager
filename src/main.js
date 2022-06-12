const { app, BrowserWindow, dialog, ipcMain, Notification } = require('electron');
const isDev = (process.env.NODE_ENV == 'dev');

const { on } = require('events');
const { palette } = require('./data/colours');
const { IdGenerator } = require('./data/helper');
const path = require('path');
const Config = require('./os/config');
const FileSystem = require('./os/file-system');
const Logger = require('./os/logger');
const MenuCreator = require('./os/menu');
const Server = require('./os/server');
const Store = require('./os/store');

const winIdGenerator = IdGenerator('win', 100);
const windows = {};
const linkIdGenerator = IdGenerator('link', 100);
const links = {};
function notifyOpenWindows(channel, ...args) {
  // console.log("---> notifyOpenWindows()", channel, ...args);
  Object.keys(windows).forEach(win => {
    windows[win].webContents.send(channel, ...args);
  });
}

const script = path.parse(__filename).base;
const logger = new Logger();
const config = new Config(logger);
const fs = new FileSystem(logger);
const store = new Store(logger, config, fs, notifyOpenWindows);
const menu = new MenuCreator(logger, config, store);
// const server = new Server(logger, config, store);

logger.log(null, script, "Started!");

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
      contextIsolation: true,
      preload: path.join(__dirname, 'os/preload.js')
    },
    // icon: path.join(__dirname, 'resources/Unmarked Die.jpg')
    icon: path.join(__dirname, 'os/resources/img/Notepad 1.png')
  });

  win.loadFile('./src/views/index.html');
  win.webContents.on('context-menu', () => {
    menu.getContextMenu().popup(win.webContents);
  });

  // store the window in the global context
  const id = winIdGenerator.next();
  windows[id.value] = win;

  win.once('closed', () => {
    // console.log(`... closing window ${id.value}`);
    delete windows[id.value];
    // console.log(windows);
  });

  win.once('ready-to-show', () => {
    win.show();
    if (isDev) win.webContents.openDevTools();
    // win.webContents.send('test', 'This is a test message...');
    win.maximize();
    win.webContents.send('initialUser', store.user);
    win.webContents.send('initialiseDictionaries', store.dictionaries);
    win.webContents.send('initialGameSystem', store.gameSystem);
    // console.log('windows:', windows);
  });
}

const createLinkWindow = (event, url) => {
  logger.log(null, script, "---> createLinkWindow()", url);
  const link = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'os/resources/img/Connect 1.png')
  });
  link.setMenuBarVisibility(false);

  // store the window in the global context
  const id = linkIdGenerator.next();
  windows[id.value] = win;

  link.setTitle(url);
  link.loadURL(url);
  link.once('closed', () => { delete windows[id.value]; });
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
  ipcMain.on('log', logger.log);
  ipcMain.on('open-link', createLinkWindow);
  ipcMain.on('set-title', menu.handleSetTitle);
  ipcMain.on('updateGameSystem', store.updateGameSystem);
  ipcMain.on('updateUser', store.updateUser);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
