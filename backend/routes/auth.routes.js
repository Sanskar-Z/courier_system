import express from 'express';
const router = express.Router();
import * as authController from '../controllers/auth.controller.js';
import validate from '../middleware/validate.middleware.js';
import Joi from 'joi';

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

const resetSchema = Joi.object({
    username: Joi.string().required(),
    new_password: Joi.string().min(6).required()
});

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/reset-password', validate(resetSchema), authController.resetPassword);

export default router;
