const { app, BrowserWindow, ipcMain } = require('electron');
const { on } = require('events');
const path = require('path');
const Logger = require('./os/logger');
const FileSystem = require('./os/file-system');

const script = __filename.split('\\').pop();
const logger = new Logger();
const fs = new FileSystem(logger);

logger.log(null, script, "Started!");

function handleSetTitle (event, title) {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win.setTitle(title);
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'os/preload.js')
    }
  });

  win.loadFile('./src/views/index.html');
}

app.whenReady().then(() => {
  ipcMain.on('set-title', handleSetTitle);
  ipcMain.on('log', logger.log);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
