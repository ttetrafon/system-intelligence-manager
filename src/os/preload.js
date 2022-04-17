const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('main', {
  // renderers send to main...
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  openLink: (url) => ipcRenderer.send('open-link', url),
  setTitle: (title) => ipcRenderer.send('set-title', title),
  log: (args) => ipcRenderer.send('log', args),
  // main sends to renderers...
  receive: (channel, func) => {
    // let validChannels = ['test', 'initialUser'];
    // if (validChannels.includes(channel))
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
