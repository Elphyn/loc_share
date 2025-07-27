

let socket = null

function setSocket(s) { 
    socket = s
}

function getSocket() {
    return socket
}

module.exports = {
    setSocket,
    getSocket
}