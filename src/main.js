const { app, BrowserWindow, dialog, ipcMain, Notification } = require('electron');
const isDev = (process.env.NODE_ENV == 'dev');

// The reloader support hot-reload of both the application and the window.
// When anything on os level changes, the whole application is reloaded.
// Changes in the renderer process force a reload of open windows only.
// https://www.geeksforgeeks.org/hot-reload-in-electronjs/
if (process.env.NODE_ENV == 'dev') {
  try { require('electron-reloader')(module, { debug: false, watchRenderer: true }); }
  catch (_) { console.log('Error: electron-reloader not loaded'); }
}

const { on } = require('events');
const { palette } = require('./data/colours');
const { IdGenerator, GetUid } = require('./data/helper');
const path = require('path');
const Config = require('./os/config');
const FileSystem = require('./os/file-system');
const Logger = require('./os/logger');
const MenuCreator = require('./os/menu');
const Server = require('./os/server');
const Store = require('./os/store');

// Creates unique ids for normal application windows. These windows are stored for reference in an object, with the ids as keys.
// A normal application window has all functionality available.
const winIdGenerator = IdGenerator('win', 100);
const windows = {};
// Creates unique ids for link windows. These windows are stored for reference in an object, with the ids as keys.
// A link window displays a website. Functionality is limited, and communication with the main process is restricted.
const linkIdGenerator = IdGenerator('link', 100);
const links = {};

function notifyOpenWindows(channel, ...args) {
  // Sends a specific message to all open application windows.
  // - channel: The channel used. The channel is used to select what function will be invoked within the renderer.
  // - args: A list of the required arguments to satisfy the target function.
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
  // Creates a normal application window.
  const win = new BrowserWindow({
    show: false,
    width: 1024,
    minWidth: 800,
    height: 768,
    minHeight: 600,
    backgroundColor: palette["background-light"],
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      contextIsolation: true, // Required to restrict communication between main process and renderer. Only predetermined routes and channels are allowed.
      preload: path.join(__dirname, 'os/preload.js') // Creates a link between the main process and the renderer.
    },
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
    // Performs actions before the specific renderer window is terminated.
    // console.log(`... closing window ${id.value}`);
    delete windows[id.value];
    // console.log(windows);
  });

  win.once('ready-to-show', () => {
    // Displays the window that has been just created.
    win.show();
    if (isDev) win.webContents.openDevTools();
    // win.webContents.send('test', 'This is a test message...');
    win.maximize();

    // Startup events are triggered once when the window has just been created.
    win.webContents.send('initialUser', store.user);
    win.webContents.send('initialiseDictionaries', store.dictionaries);
    win.webContents.send('initialGameSystem', store.gameSystem);
    // console.log('windows:', windows);
  });
}

const createLinkWindow = (event, url) => {
  // Creates a link window.
  // logger.log(null, script, "---> createLinkWindow()", url);
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
  // Listeners for events that sent from open renderers of any type.
  // Routes must be specified within the appropriate preload file.
  // .handle creates returns a promise to the trigger (two-way event route).
  ipcMain.handle('dialog:openFile', fs.handleFileOpen);
  ipcMain.handle('generate-uid', GetUid); // TODO: First check if the uid exists in the names dictionary and return it if not. If it exists, create a new one instead.
  // .on creates a simple trigger for when an event is received.
  ipcMain.on('log', logger.log);
  ipcMain.on('open-link', createLinkWindow);
  ipcMain.on('set-title', menu.handleSetTitle);
  ipcMain.on('updateDictionary', store.updateDictionary)
  ipcMain.on('updateGameSystem', store.updateGameSystem);
  ipcMain.on('updateUser', store.updateUser);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
});

app.on('window-all-closed', () => {
  // TODO: Set the system up so that the displayed windows are stored instead of saved immediately in the user.json.
  // TODO: When the application terminates, store these to be opened when it starts again.
  if (process.platform !== 'darwin') app.quit();
});
