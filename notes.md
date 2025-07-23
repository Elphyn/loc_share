

What should I start with:
    1. I think first I have to create a server that could recieve files


To make a server that recieves files I need:
    1. Host a node.js server
    2. Learn POST/GET 

It seems that I should've considered Express first, so I am going to install that first
Then I would work out how to use POST/GET and attempt sending files to the server
Also I need to learn how to interact with file system


Okay this project is actual nighmare, what I've learned today

To establish p2p connection we use webrtc, or something layered on it like simple-peer
to establish this connection between clients we need first to exchange metadata
clients don't know how to connect to each other, I've so far identified 3 ways of helping them see each other, 3 ways of creating a middle man
First an easiest is database, but that is off limits, considering that the point of the project in doing everything locally, without internet connection
Second is using webtorrent trackers, which is also web
the last way is using mDNS or a layer like node bonjour, but there's also a problem, it's not working in browsers for security reasons
Is there truly no way to making it all local, and be able to do it all without internet access and in browser

I think I am going to
Stick with node bonjour, socket.io, simple-peer but run in Electron/React Native

