
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    startServer: () => ipcRenderer.invoke('start-server'),
    getConnections: () => ipcRenderer.invoke('get-connections'),
    socketConnect: () => ipcRenderer.invoke('socket-connect'),
    setupPeer: (isInitiator, localId, remoteId) => ipcRenderer.invoke('peer-connect', isInitiator, localId, remoteId),
    onP2PConnected: (callback) => ipcRenderer.on('p2p-connected', callback),
    sendFile: (data) => ipcRenderer.invoke('send-file', data),
    onFileMeta: (callback) => ipcRenderer.on('file-meta', callback),
    onFileChunk: (callback) => ipcRenderer.on('file-chunk', callback),
    onFileDone: (callback) => ipcRenderer.on('file-done', callback)
})