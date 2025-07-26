const bonjour = require('bonjour')()
const startSignalingServer = require('./signaling_server')
const port = 3000

let connections = new Set()


async function startServer() { 
    const { httpServer, io } = await startSignalingServer(port)

    bonjour.publish({ name: 'signal-server', type: 'http', port })
    
    io.on('connection', (socket) => {
        console.log('User has connected')
        connections.add(socket)
        socket.on('disconnect', () => {
            console.log('User has disconnected')
            connections.delete(socket)
        })
    })
    
    return {
        httpServer,
        io,
        getConnections: () => connections,
        stop: () => {
            bonjour.unpublishAll()
            bonjour.destroy()
            httpServer.stop()
        }
    } 
}

module.exports = startServer