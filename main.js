const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const startServer = require("./modules/startServer");
const discoverService = require("./modules/discover");
const { stopServer } = require("./modules/signaling_server");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 500,
    height: 900,
    resizable: true,
    maximizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    win.loadURL("http://localhost:5173/");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "renderer/dist/index.html"));
  }

  win.removeMenu();
  return win;
};

let mainWindow = null;

app.whenReady().then(() => {
  mainWindow = createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createWindow();
  }
});

let serverInstance = null;
ipcMain.handle("start-server", async () => {
  try {
    console.log("Starting the server");
    serverInstance = await startServer();
    console.log("Server is working");
  } catch (err) {
    console.log("Starting server failed: ", err);
  }
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

ipcMain.handle("stop-server", async () => {
  if (serverInstance) {
    console.log("Stopping server right now");
    await serverInstance.stop();
    console.log("Server stopped");
    serverInstance = null;
  }
});
