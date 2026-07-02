const express = require('express');
const router = express.Router();
const{protect} = require("../Middleware/auth.middleware");
const {admin} = require("../Middleware/role.middleware");
const{createOrder,verifyPayment} = require("../controller/payment.controller");

router.post("/order",createOrder);
router.post("/verify",verifyPayment);

module.exports = router;