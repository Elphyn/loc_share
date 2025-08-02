
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    startServer: () => ipcRenderer.invoke('start-server'), 
    getDiscoveredServices: () => ipcRenderer.invoke('get-service'),
    getConnections: () => ipcRenderer.invoke('get-connections')
})