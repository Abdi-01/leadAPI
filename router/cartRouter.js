const express = require('express')
const { cartController } = require('../controller')
const router = express.Router()

router.post('/addToCart',cartController.addToCart)
router.get('/getCart/:id', cartController.getCart)
router.post('/checkoutCart/:id', cartController.checkoutCart)
router.delete('/deleteCart/:id', cartController.deleteCart)

module.exports = router;