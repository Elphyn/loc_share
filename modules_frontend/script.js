import { choosingSocketToConnect } from "./listing_connections.js"
const button_update = document.getElementById('update')
const button_host = document.getElementById('host-btn')
const list = document.getElementById('connections')

let localId = null

button_host.addEventListener('click', async () => {
    try {
        console.log("button pressed, server should be starting now")
        await window.electronAPI.startServer()
        console.log("Server started, now connecting local socket")
        localId = await window.electronAPI.socketConnect()
    } catch (err) {
        console.log("Something went wrong: ", err)
    }

})

button_update.addEventListener('click', async () => {
    await choosingSocketToConnect(list, localId)
})

const button_listener = document.getElementById('listener')

button_listener.addEventListener('click', async () => { 
    try {
        localId = await window.electronAPI.socketConnect()
        await window.electronAPI.setupPeer(false, localId.id)
        console.log('Connected')
    } catch (err) {
        console.log('Something went wrong ', err)
    }

})

const header = document.getElementById('peer-connection')

window.electronAPI.onP2PConnected((_event, data) => {
    
    header.textContent = `Connected to ${data.remoteId}`
    
    
})


const form = document.getElementById('file-form')
const fileInput = document.getElementById('fileInput')

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const file = fileInput.files[0]
    
    window.electronAPI.sendFile(JSON.stringify({
      type: 'file-meta',
      filename: file.name,
      filetype: file.type,
      filesize: file.size,
    }))
     
    let offset = 0
    const chunkSize = 16 * 1024
    
    while (offset < file.size) {
        const chunk = file.slice(offset, offset + chunkSize)
        const buffer = await chunk.arrayBuffer()
         
        const uint8Array = new Uint8Array(buffer)
        window.electronAPI.sendFile(Array.from(uint8Array))
        offset += chunkSize
    }
    
    window.electronAPI.sendFile(JSON.stringify({
        type: 'file-done'
    }))
     
})

let incomingChunks = []

let filename = ''
let filetype = ''

window.electronAPI.onFileMeta((_event, meta) => {
    filename = meta.filename
    filetype = meta.filetype
})

window.electronAPI.onFileChunk((_event, chunkArray) => {
    console.log('Received a chunk of a file!')
    const uint8Array = new Uint8Array(chunkArray)
    incomingChunks.push(uint8Array)
})

const receivedFiles = document.getElementById('received-files')

window.electronAPI.onFileDone((_event) => {
    const blob = new Blob(incomingChunks, {type: filetype})
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    
    a.href = url
    a.download = filename
    a.click()
    receivedFiles.append(a)
    
    incomingChunks = []
})
