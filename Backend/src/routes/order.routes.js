const express = require('express');
const router = express.Router();
const {protect} = require("../Middleware/auth.middleware.js");
const {admin} = require("../Middleware/role.middleware.js");

const{createOrder,getOrders,getOrderById,updateOrderStatus} = require("../Controller/order.controller.js");



router.route('/').post(protect,createOrder).get(protect,admin,getOrders);

router.route('/myorders').get(protect,getOrderById);

router.route('/:id/status').put(protect,admin,updateOrderStatus);

module.exports = router;