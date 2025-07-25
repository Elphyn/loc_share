const bonjour = require('bonjour')()
const {createServer} = require('node:http')
const { Server } = require('socket.io')
const { io } = require('socket.io-client')
const setupPeer = require('peer.js')

let peer
const isHost = process.argv.includes('--host')
if (isHost) {
    const port = 3000
    const server = createServer()
    const io = new Server(server)


    io.on('connection', (socket) => {
        console.log('A user connnected ')

        socket.on('signal', (data) => {
            socket.broadcast.emit('signal', data)
        })

        peer = setupPeer(false, socket) 
    })

    // don't forget to make dynamic port later
    server.listen(3000, '0.0.0.0', () => {
        console.log(`Server is listening on http://localhost:${port}`)
    })

    bonjour.publish({ name: 'signal-server', type: 'http', port:3000 })    

} else {
    const broswer = bonjour.find({ type: 'http' })

    broswer.on('up', (service) => {
        console.log(`Found service: ${service.name}`)
        
        const socket = io(`http://${service.addresses[0]}:${service.port}`)
        
        socket.on('connect', () => {
            console.log("Connected to server") 
            console.log("Initiator")
            peer = setupPeer(true, socket) 
        })

    })
    
}



