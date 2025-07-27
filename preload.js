
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    startServer: () => ipcRenderer.invoke('start-server'),
    getConnections: () => ipcRenderer.invoke('get-connections'),
    socketConnect: () => ipcRenderer.invoke('socket-connect'),
    setupPeer: (isInitiator, localId, remoteId) => ipcRenderer.invoke('peer-connect', isInitiator, localId, remoteId)
})