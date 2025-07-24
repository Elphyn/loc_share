function startConsole(peer) {
    const readline = require('readline')
    const rl = readline.createInterface({
        input: process.stdin,
        output:process.stdout
    })
    
    rl.setPrompt('> ')
    rl.prompt()
    
    rl.on('line', (line) => {
        const input = line.trim()
        
        if (input === 'exit') {
            rl.close()
            return
        } else if (input) { 
            peer.send(input)
        } 
        rl.setPrompt('> ')
        rl.prompt()
    })
    rl.on('close', () => {
        console.log('Exiting')
        process.exit(0)
    })
    
}

module.exports = startConsole