const bonjour = require('bonjour')()
const { io } = require('socket.io-client')
const { setSocket } = require('./socketStore')

function socketConnect() { 
    return new Promise((resolve, reject) => {
        const broswer = bonjour.find({ type: 'http' })

        broswer.on('up', (service) => {
            console.log(`Found service: ${service.name}`)
            console.log(`ip: ${service.addresses[0]}:${service.port}`)
            
            const socket = io(`http://${service.addresses[0]}:${service.port}`)
            
            socket.on('connect', () => {
                console.log("Connected to server") 
                console.log(`SocketId: ${socket.id}`)
                setSocket(socket)
                resolve({
                    id: socket.id
                })
            })
            
            socket.on('error', (err) => {
                reject(err)
            })
        })
    })
}

module.exports = socketConnect