const express = require('express')
const multer = require('multer')

const WebSocket = require('ws')

const app = express()
const port = 3000
app.use(express.static('public'))

const storage = multer.diskStorage({ 
    destination: (_, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })
app.post('/upload', upload.single('myFile'), (req, res) => {
    console.log(`file: ${req.file}`)
    res.send("Done")
})

app.get('/', (req, res) => {
    res.send("hello")
    console.log('Hello, World!')
})

app.listen(port, '0.0.0.0', () => {
    console.log(`listening on port ${port}`)
})