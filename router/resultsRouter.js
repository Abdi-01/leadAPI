const express = require('express')
const { resultsCOntroller } = require('../controller')
const router = express.Router()

router.get('/getBestSaler', resultsCOntroller.getBestSaler)
router.get('/getSaleAmount', resultsCOntroller.getSalesAmount)
router.get('/getUserAmount', resultsCOntroller.getUserAmount)
router.get('/getPendingOrderAmount', resultsCOntroller.getPendingOrderAmount)
router.get('/getSuccessOrderAmount', resultsCOntroller.getSuccessOrderAmount)
router.get('/getCategorySale', resultsCOntroller.getCategorySale)

module.exports = router