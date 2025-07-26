const Peer = require('simple-peer')
const wrtc = require('wrtc')
const { getSocket } = require('./socketStore')

function setupPeer(isInitiator, localId, remoteId) {
    const socket = getSocket()
    return new Promise((resolve, reject) => {
        const peer = new Peer({
            initiator: isInitiator,
            trickle: false,
            wrtc
        })
        
        peer.on('signal', data => {
            socket.emit('signal', {
                to: remoteId,
                from: localId,
                data
            })
        })
        
        socket.on('signal', ({from, data}) => {
            if (from === remoteId) {
                console.log('Received signal', from)
                peer.signal(data)
            }
        })
        peer.on('connect', () => {
            console.log('Peer connected')
            resolve(peer)
        })
        
        peer.on('error', (err) => {
            console.log('Something went wrong ', err)
            reject(err)
        })
    })

}

// function setupPeer(isInitiator, socket) {
//     peer = new Peer({
//         initiator: isInitiator,
//         trickle: false,
//         wrtc,
//     })
    
//     peer.on('signal', data => {
//         socket.emit('signal', data)
//     })
    
//     socket.on('signal', (data) => {
//         console.log('Recieved signal' + data.type)
//         peer.signal(data)
//     })
    
//     peer.on('connect', () => {
//         console.log("Peer connected!") 
//     })
    
//     peer.on('data', (data) => {
//         console.log(`Received message: ${data.toString()}`)
//     })
    
//     peer.on('error', (err) => {
//         console.error('Something went wrong: ', err)
//     })
    
//     return peer

// }

module.exports = setupPeer