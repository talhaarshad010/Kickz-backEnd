const express = require('express');
const userController = require('./usercontroller');
const router = express.Router();

router.post('/UserSignup', userController.userSignup);
router.post('/InstructorSignup', userController.instructorSignup);
router.post('/UserLogin', userController.userLogin);
router.post('/InstructorLogin', userController.instructorLogin);

module.exports = router;
