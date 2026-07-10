import { Router } from "express";
import { gym_controller } from "../controller/gym/gym_controller.js";
import { validateCustomerMiddleware } from "../middleware/gym_validation.js";
import {verifyAccessToken} from "../middleware/accesstoken_validation.js";
import {verifyAccess} from "../middleware/verifyAccess.js"; 

export const gymRouter = Router();

gymRouter.get('/', verifyAccessToken,gym_controller.getCustomers);
gymRouter.post('/',verifyAccessToken,validateCustomerMiddleware, gym_controller.createCustomer);
//gymRouter.delete('/',verifyAccessToken, gym_controller.deleteCustomer);
gymRouter.patch('/',verifyAccessToken, verifyAccess, validateCustomerMiddleware, gym_controller.UpdateCustomer);
