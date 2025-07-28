const { getPeer } = require("./peerStorage");


function sendData(data) {
    getPeer().send(data)
}


module.exports = sendData