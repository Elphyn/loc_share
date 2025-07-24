function startConsole() {
    const readline = require('readline')
    const rl = readline.createInterface({
        input: process.stdin,
        output:process.stdout
    })
    
    rl.setPrompt('> ')
    rl.prompt()
    
    rl.on('line', (line) => {
        const trimmed = line.trim()
        
        if (trimmed === 'exit') {
            rl.close()
            return
        }
    })
    rl.on('close', () => {
        console.log('Exiting')
        process.exit(0)
    })
    
}

module.exports = startConsole