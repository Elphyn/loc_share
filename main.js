const { app, BrowserWindow, contentTracing, ipcMain } = require('electron')
const path = require('node:path')
const startServer = require('./modules/startServer')

const createWindow = () => {
    const win = new BrowserWindow({
        width:800,
        height:600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    
    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
})

let serverInstance 
ipcMain.handle('start-server', async () => {
    serverInstance = await startServer()
    return 'ok'
})

ipcMain.handle('get-connections', () => {
    if (!serverInstance) return []
    
    const sockets = Array.from(serverInstance.getConnections())
    return sockets.map((socket) => ({
        id: socket.id
    }))
})