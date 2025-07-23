
const bonjour = require('bonjour')()
const { io } = require('socket.io-client')


const broswer = bonjour.find({ type: 'http' })

broswer.on('up', (service) => {
    console.log(`Found service: ${service.name}`)
    
    const socket = io(`http://${service.addresses[0]}:${service.port}`)
    
    socket.on('connect', () => {
        console.log("Connected to server")
    })

})



