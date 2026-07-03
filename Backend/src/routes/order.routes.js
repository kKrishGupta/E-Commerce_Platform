const express = require('express');
const router = express.Router();
const {protect} = require("../middleware/auth.middleware.js");
const {admin} = require("../middleware/role.middleware.js");

const{createOrder,getOrders,getOrderById,updateOrderStatus} = require("../controller/order.controller.js");



router.route('/').post(protect,createOrder).get(protect,admin,getOrders);

router.route('/myorders').get(protect,getOrderById);

router.route('/:id/status').put(protect,admin,updateOrderStatus);

module.exports = router;