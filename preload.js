const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  startServer: () => ipcRenderer.invoke("start-server"),
  getDiscoveredServices: () => ipcRenderer.invoke("get-service"),
  getConnections: () => ipcRenderer.invoke("get-connections"),
  onSocketConnected: (callback) =>
    ipcRenderer.on("socket-connected", (event, socketId) => {
      callback(socketId);
    }),
  onSocketDisconnected: (callback) =>
    ipcRenderer.on("socket-disconnected", (event, socketId) => {
      callback(socketId);
    }),
});
