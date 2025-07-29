
let peer = null


function setPeer(settedPeer) {
    peer = settedPeer
}

function getPeer() {
    return peer
}

module.exports = {
    setPeer,
    getPeer
}

