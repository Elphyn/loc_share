// I don't really need to pass in localID, remove later
// 
export async function choosingSocketToConnect(list, localId) {    
    const arr = await window.electronAPI.getConnections()
    list.innerHTML = ''

    arr.forEach(remoteId => {
    const container = document.createElement('div')
    const li = document.createElement('li')
    const button_connect = document.createElement('button')

    li.textContent = `Socket ID: ${remoteId.id}`
    button_connect.textContent = 'connect'

    button_connect.addEventListener('click', async () => {
        console.log(`Connecting to peer: ${remoteId.id} from ${localId.id}`)
        try {
            await window.electronAPI.setupPeer(true, localId.id, remoteId.id)
            console.log("p2p connected")        
        } catch (err) {
            console.log("Something went wrong: ", err)
        }
        console.log('Connected')
    }) 
    container.append(li)
    console.log('localID: ', localId.id)
    if (remoteId.id !== localId.id) {
        container.append(button_connect)
    } else {
        const label = document.createElement('p')
        label.textContent = ' (local) '
        container.append(label)
    }
    list.append(container) 
    });
}
