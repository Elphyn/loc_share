const { app, BrowserWindow, contentTracing, ipcMain } = require('electron')
const path = require('node:path')
const startServer = require('./modules_backend/startServer')
const socketConnect = require('./modules_backend/connect')
const setupPeer = require('./modules_backend/peer')

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

ipcMain.handle('socket-connect', async () => {
    res = await socketConnect()
    return res
})

ipcMain.handle('peer-connect', async (event, isInitiator, localId, remoteId) => {
    try {    
        const peer = await setupPeer(isInitiator, localId, remoteId)
        
        const webContents = event.sender
        webContents.send('p2p-connected', { remoteId })
        
        return { success: true }
    } catch (err) {
        console.error("Error in peer-connect: ", err)
        return {success: false, error: err}
    }
})