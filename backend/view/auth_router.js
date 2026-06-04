import { Router } from "express";
import { auth_controller } from "../controller/auth_controller.js";

export const authRouter = Router();

authRouter.get('/', auth_controller.getUsers);
authRouter.post('/register', auth_controller.registerUser);
authRouter.post('/reg', auth_controller.registerEmployee);
authRouter.post('/re', auth_controller.registerAdmin);
authRouter.post('/login', auth_controller.login);