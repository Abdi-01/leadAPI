const express = require('express')
const { transactionController } = require('../controller')
const router = express.Router()
const { auth } = require('../helper/authDecode')

router.post('/addToTransaction', auth, transactionController.addToTransaction)
router.get('/getTransaction/:status', auth, transactionController.getTransaction)
router.get('/getDetailTransaction/:status', auth, transactionController.getDetailTransaction)
router.get('/getCustomDetailTransaction/:status', auth, transactionController.getCustomDetailTransaction)
// router.get('/getStockUpdate/:id', transactionController.getStockUpdate)
router.put('/addTransferReceipt', auth, transactionController.addTransferReceipt)
router.put('/verifieOrder', auth, transactionController.verifieTransaction)

// router.put('/updateStock', transactionController.)

module.exports = router;