const express = require('express')
const { userController } = require('../controller')
const router = express.Router();
const { auth } = require('../helper/authDecode')

router.get('/getAllUsers', userController.getUsers)
router.get('/getSearchUsers/:search', userController.getUsersSearch)
router.post('/login', userController.login)
router.post('/keeplogin', auth, userController.keepLogin)
router.post('/register', userController.register)
router.post('/emailVerification', auth, userController.emailVerification)
router.post('/editProfile/:id', userController.editProfile)
router.post('/editPassword/:id', userController.editPassword)

module.exports = router