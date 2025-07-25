
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    startServer: () => ipcRenderer.invoke('start-server'),
    getConnections: () => ipcRenderer.invoke('get-connections')
})