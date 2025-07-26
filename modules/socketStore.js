

let socket = null

function setSocket(s) { 
    setSocket = s
}

function getSocket() {
    return socket
}

module.exports = {
    setSocket,
    getSocket
}