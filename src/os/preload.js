const { contextBridge, dialog, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('main', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  setTitle: (title) => ipcRenderer.send('set-title', title),
  log: (source, message) => ipcRenderer.send('log', source, message)
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
