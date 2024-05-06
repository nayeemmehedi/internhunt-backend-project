const express = require('express');
// const { signupController } = require('../controllers/authentication.controller.js');
// const { loginController } = require('../controllers/login.controller.js');
const { signupController } = require('../controllers/authentication.controllers.js');
const { CompanyInfoController, loginController } = require('../controllers/login.controller.js');
const refreshTokenController = require('../controllers/refreshToken.controller.js');
const LogOutController = require('../controllers/logOut.controller.js');
const { goggleLogin } = require('../controllers/google.login.controllers.js');

// import { GenerateAccessToken } from '../controllers/generateToken.controller.js';

const signupRoutes = express.Router();

signupRoutes.post('/register',signupController )
signupRoutes.post('/login', loginController)
signupRoutes.get('/companyInfo', CompanyInfoController)
signupRoutes.post('/google/login', goggleLogin)


// signupRoutes.post('/adminLogin', adminLoginController)
// signupRoutes.post('/admin', adminMain)


signupRoutes.post('/refresh', refreshTokenController)
signupRoutes.post('/logout', LogOutController)




module.exports = { signupRoutes }