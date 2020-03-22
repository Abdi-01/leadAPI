const express = require('express')
const { chatController } = require('../controller')
const router = express.Router()

router.get('/getMessages', chatController.getMessages)
router.post('/sendMessages', chatController.sendMessage)
router.delete('clearMessages', chatController.clearMessages)


module.exports = router