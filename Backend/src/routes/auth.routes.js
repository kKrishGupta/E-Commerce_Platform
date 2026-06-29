const express = require('express');
const router = express.Router();
const {loginUser , registerUser,logoutUser,sendLoginOtp,verifyLoginOtp,verifyRegisterOtp,getUsers,sendForgotPasswordOtp,verifyForgotPasswordOtp,resetPassword} = require("../Controller/auth.controller.js");
const {protect} = require("../Middleware/auth.middleware.js");
const {admin} = require("../Middleware/role.middleware.js");



router.post("/login", loginUser);
router.post("/login/send-otp", sendLoginOtp);
router.post("/login/verify-otp", verifyLoginOtp);

router.post("/register" ,registerUser );

router.post("/logout",logoutUser);
router.get("/users",protect,admin, getUsers);
router.post("/register/verify-otp",verifyRegisterOtp);
router.post("/forgot-password/send-otp",sendForgotPasswordOtp);
router.post("/forgot-password/verify-otp",verifyForgotPasswordOtp);
router.post("/forgot-password/reset-password",resetPassword);

module.exports = router;