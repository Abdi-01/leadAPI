const express = require('express')
const app = express()
const port = 2020
const bodyParser = require('body-parser')
const cors = require('cors')
const bearerToken = require('express-bearer-token');//setiap ada token yang terdapat pada front end akan dijadikan req.user

app.use(bodyParser())
app.use(cors())
app.use(bearerToken())//mengambil token berdasarkan header yang dikirim oleh frontend pada authAction
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))//lokasi folder gambar pada API

const { userRouter, productRouter, cartRouter, transactionRouter, rajaOngkirRouter,resultsRouter } = require('./router')

app.use('/users', userRouter) ///untuk manipulasi data disebut endpoint
app.use('/products', productRouter) ///untuk manipulasi data disebut endpoint
app.use('/carts', cartRouter) ///untuk manipulasi data disebut endpoint
app.use('/transactions', transactionRouter) ///untuk manipulasi data disebut endpoint
app.use('/results', resultsRouter) ///untuk manipulasi data disebut endpoint
app.use('/ongkir', rajaOngkirRouter) ///untuk manipulasi data disebut endpoint

app.listen(port, () => { console.log(port) })//port access backend di localhost