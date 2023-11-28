const express = require('express');
const { getAllOrders, getOrder, editOrder, deleteOrder, newOrder } = require('../controllers/order.controller');
const router = express.Router();

router.get('/', getAllOrders);
router.get('/:id', getOrder);
router.post('/', newOrder);
router.put('/:id', editOrder);
router.delete('/:id', deleteOrder);

module.exports = router;