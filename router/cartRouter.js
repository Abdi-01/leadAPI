const express = require('express')
const { cartController } = require('../controller')
const { auth } = require('../helper/authDecode')
const router = express.Router()

router.post('/addToCart', cartController.addToCart)
router.get('/getCart', auth, cartController.getCart)
router.post('/checkoutCart/:id', cartController.checkoutCart)
router.delete('/deleteCart/:id', cartController.deleteCart)

module.exports = router;