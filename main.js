const { app, BrowserWindow, ipcMain } = require("electron");

const path = require("node:path");
const startServer = require("./modules/startServer");
const discoverService = require("./modules/discover");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 380,
    height: 680,
    resizable: true,
    maximizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadURL("http://localhost:5173/");

  // win.removeMenu();
};

app.whenReady().then(() => {
  createWindow();
});

let serverInstance = null;
ipcMain.handle("start-server", async () => {
  serverInstance = await startServer();
  console.log("Server has started");
});

ipcMain.handle("get-service", async () => {
  const res = await discoverService();
  return res;
});

ipcMain.handle("get-connections", () => {
  if (!serverInstance) return [];

  const sockets = Array.from(serverInstance.getConnections());
  return sockets.map((socket) => ({
    id: socket.id,
  }));
});
