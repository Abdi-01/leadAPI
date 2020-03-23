const express = require('express')
const http = require('http')
const SocketIO = require('socket.io')
const bodyParser = require('body-parser')
const cors = require('cors')
const bearerToken = require('express-bearer-token');//setiap ada token yang terdapat pada front end akan dijadikan req.user

const port = process.env.PORT || 2020

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(bearerToken())//mengambil token berdasarkan header yang dikirim oleh frontend pada authAction
app.use(bodyParser.urlencoded({ extended: false }))//
app.use(express.static('public'))//lokasi folder gambar pada API

///Socket Io for chating auto update
const server = http.createServer(app)//membuat server untuk socket
const io = SocketIO(server)//jalur input output socket
var arrMsg = []
var userCount = 0
app.io = io
app.arrMsg = arrMsg

app.get('/', (req, res) => {
  res.send('Welcome To Lead API')
})

const { userRouter, productRouter, cartRouter, transactionRouter, rajaOngkirRouter, resultsRouter, chatRouter } = require('./router')

app.use('/users', userRouter) ///untuk manipulasi data disebut endpoint
app.use('/products', productRouter) ///untuk manipulasi data disebut endpoint
app.use('/carts', cartRouter) ///untuk manipulasi data disebut endpoint
app.use('/transactions', transactionRouter) ///untuk manipulasi data disebut endpoint
app.use('/results', resultsRouter) ///untuk manipulasi data disebut endpoint
app.use('/ongkir', rajaOngkirRouter) ///untuk manipulasi data disebut endpoint
app.use('/chat', chatRouter) ///untuk manipulasi data disebut endpoint

io.on('connection', socket => {
    // console.log('User connected')
    userCount+=1;
    io.emit('user connected', userCount)
    
    socket.on('disconnect', () => {
      // console.log('user disconnected')
      userCount--;
      io.emit('user connected', userCount)
    })
  })

server.listen(port, () => { console.log(port) })//port access backend di localhost