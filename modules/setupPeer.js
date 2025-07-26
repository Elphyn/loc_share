const Peer = require('simple-peer')
const wrtc = require('wrtc')
const { getSocket } = require('./socketStore')

function setupPeer(isInitiator, localId, remoteId = null) {
    const socket = getSocket()
    return new Promise((resolve, reject) => {
        const peer = new Peer({
            initiator: isInitiator,
            trickle: false,
            wrtc
        })
        
        // if (isInitiator && !remoteId) {
        //     return reject(new Error('Initiator must speicify remoteID'))
        // }
        
        peer.on('signal', data => {
            if (!remoteId) {
                console.warn("No remoteId yet, can't emit")
                return
            }

            socket.emit('signal', {
                to: remoteId,
                from: localId,
                data
            })
        })
        
        socket.on('signal', ({from, data}) => {
            if (!remoteId) {
                remoteId = from
            }
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

module.exports = setupPeer