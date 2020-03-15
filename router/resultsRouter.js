const express = require('express')
const { resultsCOntroller } = require('../controller')
const router = express.Router()

router.get('/getBestSaler', resultsCOntroller.getBestSaler)
router.get('/getSaleAmount', resultsCOntroller.getSalesAmount)

module.exports = router