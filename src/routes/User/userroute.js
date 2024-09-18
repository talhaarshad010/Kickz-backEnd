const express = require('express');
const userController = require('./usercontroller');
const router = express.Router();

router.post('/UserSignup', userController.userSignup);
router.post('/UserLogin', userController.userLogin);
router.post('/ForgotPassword', userController.forgetpassword);
router.post('/VerifyOtp', userController.verifyOtp);
router.post('/UpdatePassword', userController.updatePassword);

module.exports = router;
