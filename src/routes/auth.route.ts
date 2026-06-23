import { Router } from "express";
import { loginController, RegisterController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const authroutes = Router();

// Route to register a new user
authroutes.post('/register', RegisterController);

// Route to login a user
authroutes.post('/login', loginController);

export default authroutes;