const express = require('express')
const bonjour = require('bonjour')()
const {createServer} = require('node:http')
const { Server } = require('socket.io')


const app = express()
const port = 3000

const server = createServer(app)
const io = new Server(server)

app.get('/', (req, res) => {
    res.send('Hello from signaling server') 
})

io.on('connection', (socket) => {
    console.log('A user connnected ')
    
    socket.on('signal', (offer) => {
        io.emit('signal', offer)
    })
    
})

server.listen(3000, '0.0.0.0', () => {
    console.log(`Server is listening on http://localhost:${port}`)
})

bonjour.publish({ name: 'signal-server', type: 'http', port:3000 })
