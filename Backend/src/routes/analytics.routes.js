const express = require('express');
const router = express.Router();
const {protect} = require("../Middleware/auth.middleware.js");
const {admin} = require("../Middleware/role.middleware.js");

const{getAdminStats} = require("../controller/analytics.controller.js");

router.get("/",protect,admin,getAdminStats);

module.exports = router;