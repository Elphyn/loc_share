const { getPeer } = require('./peerStorage')



async function sendFile(file) {

    peer.send(JSON.stringify({
      type: 'file-meta',
      filename: file.name,
      filetype: file.type,
      filesize: file.size,
    }))

    const chunks = sliceFile(file)
    
    for (const chunk of chunks) {
        const buffer = await chunk.arrayBuffer()
        getPeer.send(buffer)
    }
    
    getPeer.send(JSON.stringify({type: 'file-done'}))
}

function assembleFile(chunks, meta) {
    const blob = new Blob(chunks, {type : meta.filetype})
}

module.exports = sendFile