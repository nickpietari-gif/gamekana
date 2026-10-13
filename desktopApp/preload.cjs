const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopProgress', Object.freeze({
  loadProgress: () => ipcRenderer.invoke('progress:load'),
  saveProgress: (progress) => ipcRenderer.invoke('progress:save', progress)
}));
