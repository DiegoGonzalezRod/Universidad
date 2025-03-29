const {check} = require('express-validator');
const validateResults = require('../utils/handleValidator');
//const { validate } = require('../models/storage');

const validatorCreateItem = [
    check('name').exists().notEmpty().isString().withMessage('El nombre no es válido'),
    check('email').exists().notEmpty().isEmail().withMessage('El mail no es válido'),
    check('password').exists().notEmpty().isLength({min: 8}).withMessage('La contraseña debe tener al menos 8 caracteres'),
    check("code").exists().notEmpty().withMessage("El código es obligatorio").isLength({ min: 6, max: 6 }).withMessage("Debe tener 6 dígitos").isNumeric().withMessage("Debe ser numérico"),

    (req,res,next) => validateResults(req,res,next)
]
const validatorGetItem = [
    check('email').exists().notEmpty().isEmail(),
    check('password').exists().notEmpty(),
    (req,res,next) => validateResults(req,res,next)
]

const validatorVerifyCode = [
    check("code")
      .exists().notEmpty().withMessage("El código es obligatorio")
      .isLength({ min: 6, max: 6 }).withMessage("El código debe tener 6 dígitos")
      .isNumeric().withMessage("El código debe ser numérico"),
    (req, res, next) => validateResults(req, res, next)
  ];



module.exports = {validatorCreateItem, validatorGetItem, validatorVerifyCode}