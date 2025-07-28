import { choosingSocketToConnect } from "./listing_connections.js"
const button_update = document.getElementById('update')
const button_host = document.getElementById('host-btn')
const list = document.getElementById('connections')
const event = new Event('p2p-connected')

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

button_update.addEventListener('click', () => choosingSocketToConnect(list, localId))

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

