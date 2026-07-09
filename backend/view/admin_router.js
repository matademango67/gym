import { Router } from "express";
import { auth_controller } from "../controller/auth_controller.js";
import { gym_controller } from "../controller/gym/gym_controller.js";
import { paymentController } from "../controller/gym/payment_controller.js";
import { validateUserMiddleware, validateUpdateMiddleware , validateStatusMiddleware} from "../middleware/auth_validation.js";
import {verifyAdmin} from "../middleware/roles.js"
import {verifyAccessToken} from "../middleware/accesstoken_validation.js"
export const AdminRouter = Router();

AdminRouter.get('/',verifyAccessToken, verifyAdmin, auth_controller.getUsers);
AdminRouter.get('/customers',verifyAccessToken, verifyAdmin, gym_controller.getAllCustomers);
AdminRouter.get('/findcustomer/:search',verifyAccessToken,verifyAdmin, gym_controller.SearchCustomer);
AdminRouter.post('/register', verifyAccessToken, verifyAdmin, validateUserMiddleware, (req, res) => auth_controller.registerUser(req, res, "admin"));
AdminRouter.post('/register/employee', verifyAccessToken, verifyAdmin, validateUserMiddleware, (req, res) => auth_controller.registerUser(req, res, "employee"));
AdminRouter.patch('/setUserStatus',verifyAccessToken, verifyAdmin,validateStatusMiddleware, auth_controller.setUserStatus);
AdminRouter.get('/payments',verifyAccessToken, verifyAdmin, paymentController.get_allpayments);
//authRouter.post('/reg',  validateUserMiddleware, auth_controller.registerEmployee);
///authRouter.post('/re',  validateUserMiddleware, auth_controller.registerAdmin);


//


      