const express = require('express')
const { cartController } = require('../controller')
const { auth } = require('../helper/authDecode')
const router = express.Router()

router.post('/addToCart', cartController.addToCart)
router.post('/customOrder', cartController.customOrder)
router.get('/getCustomOrder', auth, cartController.getCustomOrder)
router.get('/getCart', auth, cartController.getCart)
router.post('/checkoutCart/:id', cartController.checkoutCart)
router.delete('/deleteCart/:id', cartController.deleteCart)
router.delete('/deleteCustomOrder/:id', cartController.deleteCustomOrder)

module.exports = router;