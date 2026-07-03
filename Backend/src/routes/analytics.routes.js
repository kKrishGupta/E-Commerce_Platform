const express = require('express');
const router = express.Router();
const {protect} = require("../middleware/auth.middleware.js");
const {admin} = require("../middleware/role.middleware.js");

const{getAdminStats} = require("../controller/analytics.controller.js");

router.get("/",protect,admin,getAdminStats);

module.exports = router;