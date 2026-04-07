const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');
const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    full_name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.string().required()
});

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

module.exports = router;
