const express = require('express')
const { transactionController } = require('../controller')
const router = express.Router()
const { auth } = require('../helper/authDecode')

router.post('/addToTransaction/:uID', transactionController.addToTransaction)
router.get('/getTransaction', auth, transactionController.getTransaction)


module.exports = router;