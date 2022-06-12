const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('main', {
  // renderers send to main...
  log: (...args) => ipcRenderer.send('log', ...args),
  openFile: _ => ipcRenderer.invoke('dialog:openFile'),
  openLink: (url) => ipcRenderer.send('open-link', url),
  setTitle: (_) => ipcRenderer.send('set-title', _),
  updateGameSystem: (part, data) => ipcRenderer.send('updateGameSystem', part, data),
  updateUser: (user) => ipcRenderer.send('updateUser', user),
  // main sends to renderers...
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});
