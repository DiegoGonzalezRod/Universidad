const express = require("express")
const {createItem} = require('../controllers/users');
const {userLogin} = require('../controllers/users');
const {updateUserPersonalData } = require('../controllers/users');
const {updateUserCompanyData } = require('../controllers/users');
const { validatorCreateItem, validatorGetItem } = require("../validators/user");
const { validateEmailCode } = require('../controllers/users');
const { validatorVerifyCode } = require('../validators/user');
const authMiddleware = require('../middleware/session');

const userRouter = express.Router();
userRouter.post('/register', validatorCreateItem, createItem);
userRouter.post('/login', validatorGetItem, userLogin);
userRouter.post('/validation', authMiddleware, validatorVerifyCode, validateEmailCode);
userRouter.patch('/onboardingUser', authMiddleware,updateUserPersonalData); 
userRouter.patch('/onboardingCompany', authMiddleware,updateUserCompanyData); 
module.exports = userRouter