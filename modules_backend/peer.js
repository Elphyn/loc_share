const Peer = require('simple-peer')
const wrtc = require('wrtc')
const { getSocket } = require('./socketStore')
const { setPeer } = require('./peerStorage')


let peer = null

function setupPeer(isInitiator, localId, remoteId = null) {
    const socket = getSocket()
    return new Promise((resolve, reject) => {
        
        function createPeer() {
            peer = new Peer({initiator: isInitiator, trickle: false, wrtc})
            peer.on('signal', (data) => {
                socket.emit('signal', {
                    to: remoteId,
                    signal: data
                })
            })
            
            peer.on('connect', () => {
                console.log('p2p established')
                peer.send('Hello to other peer')
                setPeer(peer)
                resolve()
            })
            
            peer.on('data', (data) => {
                console.log(`Message from peer: ${data}`)
            })
        }
        
        
        socket.on('signal', ({from, signal}) => {

            if (!remoteId) {
                remoteId = from
            }
            
            if (!isInitiator && !peer) {
                console.log('Creating peer after receiving offer')
                createPeer()
            }
            
            try {
                peer.signal(signal)
            } catch (err) {
                console.error('Error while processing signal: ', err)
            }
        })
        if (isInitiator) {
            console.log('Creating peer as initiator')
            createPeer()
        } else {
            console.log('Waiting for offer as a listener')
        }
    })
    

}

module.exports = setupPeer