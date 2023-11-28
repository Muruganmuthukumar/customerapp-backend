const express = require('express');
const { getAllProducts, getProduct, newProduct, editProduct, deleteProduct } = require('../controllers/product.controller');
const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.post("/", newProduct);
router.put('/:id', editProduct);
router.delete('/:id', deleteProduct)

module.exports = router;