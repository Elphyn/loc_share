const { app, BrowserWindow, contentTracing, ipcMain, webContents } = require('electron')
const path = require('node:path')
const startServer = require('./modules_backend/startServer')
const socketConnect = require('./modules_backend/connect')
const setupPeer = require('./modules_backend/peer')
const sendFile = require('./modules_backend/fileHandling')
const { type } = require('node:os')

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

let peer = null
ipcMain.handle('peer-connect', async (event, isInitiator, localId, remoteId) => {
    try {    
        peer = await setupPeer(isInitiator, localId, remoteId)
        
        const webContents = event.sender
        webContents.send('p2p-connected', { remoteId })
        peer.on('data', (data) => {
            console.log('Receiving data: ', typeof data, data)

            try {
                // Attempt to decode as string and parse as JSON
                const str = data.toString()
                const parsed = JSON.parse(str)

                // If parsing succeeds, it's a control message (like file-meta)
                console.log('Parsed JSON type:', parsed.type)

                switch (parsed.type) {
                    case 'file-meta':
                        webContents.send('file-meta', parsed)
                        break
                    case 'file-done':
                        webContents.send('file-done')
                        break
                }

            } catch (err) {
                // If it's not JSON, treat it as a binary chunk
                console.log('Received binary chunk')
                const chunkArray = Array.from(data)
                webContents.send('file-chunk', chunkArray)
            }
        })
        
        return { success: true }
    } catch (err) {
        console.error("Error in peer-connect: ", err)
        return {success: false, error: err}
    }
})

ipcMain.handle('send-file', (event, data) => {
    console.log(typeof data)
    if (typeof data === 'string') {
        console.log('Sending meta/done')
        peer.send(data)
    } else if (Array.isArray(data)) {
        console.log('Sending file-chunk')
        const uint8Array = new Uint8Array(data)
        peer.send(uint8Array)
    } else {
        console.log('Wrong format')
    }
})

