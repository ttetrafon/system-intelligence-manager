const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('main', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  setTitle: (title) => ipcRenderer.send('set-title', title),
  log: (args) => ipcRenderer.send('log', args),
  openLink: () => ipcRenderer.send('new-view')
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
