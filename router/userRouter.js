const express = require('express')
const { userController } = require('../controller')
const router = express.Router();
const { auth } = require('../helper/authDecode')

router.get('/getAllUsers', userController.getUsers)
router.get('/getSearchUsers', userController.getUsersSearch)
router.post('/login', userController.login)
router.post('/keeplogin', auth, userController.keepLogin)
router.post('/register', userController.register)
router.post('/emailVerification', auth, userController.emailVerification)
router.post('/editProfile', auth, userController.editProfile)
router.post('/editPassword', auth, userController.editPassword)

module.exports = router