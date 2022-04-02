const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { on } = require('events');
const path = require('path');
const Config = require('./os/config');
const Logger = require('./os/logger');
const FileSystem = require('./os/file-system');
const MenuCreator = require('./os/menu');

const script = __filename.split('\\').pop();
const logger = new Logger();
const config = new Config(logger);
const fs = new FileSystem(logger);
const menu = new MenuCreator(logger, config);

logger.log(null, script, "Started!");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'os/preload.js')
    }
  });

  win.loadFile('./src/views/index.html');
  win.webContents.on('context-menu', () => {
    menu.getContextMenu().popup(win.webContents);
  });

  win.webContents.openDevTools();
}

menu.createAppMenu();

app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', fs.handleFileOpen);
  ipcMain.on('set-title', menu.handleSetTitle);
  ipcMain.on('log', logger.log);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
