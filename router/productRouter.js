const express = require('express')
const { productController } = require('../controller')
const router = express.Router();

router.post('/upload', productController.uploadProduct);
router.post('/edit', productController.editProduct);
router.delete('/delete', productController.deleteProduct)
router.get('/getProductById/:id', productController.getProductById)
router.get('/getproducts', productController.getAllProduct)

router.get('/getSize', productController.getAllSize)

router.get('/getMaterial', productController.getAllMaterial)

router.get('/getCategories/:id', productController.getCategories)

router.get('/getStock', productController.getStock);
router.get('/getStockDetail/:id', productController.getStockDetail);
router.post('/addStock', productController.addStock);

module.exports = router;