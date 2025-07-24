const Peer = require('simple-peer')
const wrtc = require('wrtc')
const startConsole = require('./console')


function setupPeer(isInitiator, socket) {
    peer = new Peer({
        initiator: isInitiator,
        trickle: false,
        wrtc,
    })
    
    peer.on('signal', data => {
        socket.emit('signal', data)
    })
    
    socket.on('signal', (data) => {
        console.log('Recieved signal' + data.type)
        peer.signal(data)
    })
    
    peer.on('connect', () => {
        console.log("Peer connected!") 
        startConsole(peer)
    })
    
    peer.on('data', (data) => {
        console.log(`Received message: ${data.toString()}`)
    })
    
    peer.on('error', (err) => {
        console.error('Something went wrong: ', err)
    })
    
    return peer

}

module.exports = setupPeer