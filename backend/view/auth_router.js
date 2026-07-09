import { Router } from "express";
import { auth_controller } from "../controller/auth_controller.js";
import { validateUserMiddleware, validateUpdateMiddleware } from "../middleware/auth_validation.js";
import {verifyAccessToken} from "../middleware/accesstoken_validation.js"
export const authRouter = Router();

authRouter.get('/', auth_controller.getUsers);
authRouter.post('/register', validateUserMiddleware, auth_controller.registerUser);
authRouter.post('/login',  validateUserMiddleware, auth_controller.login);
authRouter.post('/refresh', auth_controller.refreshToken);
authRouter.patch('/Update', validateUpdateMiddleware , auth_controller.update);
authRouter.delete('/logout', auth_controller.logout);
authRouter.delete('/me' , verifyAccessToken, auth_controller.delete_me)

