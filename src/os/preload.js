const { contextBridge, ipcRenderer } = require('electron');
// A preload script determines how the main process and the renderer that invoked it will communicate with each other.

// Establish the communication channels.
// Note that listeners must also be defined; otherwise this does not work on its own.
contextBridge.exposeInMainWorld('main', {
  // renderers send to main...
  log: (...args) => ipcRenderer.send('log', ...args),
  openLink: (url) => ipcRenderer.send('open-link', url),
  setTitle: (_) => ipcRenderer.send('set-title', _),
  updateDictionary: (part, data) => ipcRenderer.send('updateDictionary', part, data),
  updateGameSystem: (part, data) => ipcRenderer.send('updateGameSystem', part, data),
  updateUser: (user) => ipcRenderer.send('updateUser', user),
  // ... and main responds
  openFile: _ => ipcRenderer.invoke('dialog:openFile'),
  generateUid: _ => ipcRenderer.invoke('generate-uid'),
  // main sends to renderers...
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  }
});
