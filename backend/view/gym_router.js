import { Router } from "express";
import { gym_controller } from "../controller/gym/gym_controller.js";
import { validateCustomerMiddleware } from "../middleware/gym_validation.js";
import {verifyAccessToken} from "../middleware/accesstoken_validation.js";

export const gymRouter = Router();

gymRouter.get('/', verifyAccessToken,gym_controller.getCustomers);
//admin route gymRouter.get('/:search', gym_controller.SearchCustomer);
gymRouter.post('/',verifyAccessToken,validateCustomerMiddleware, gym_controller.createCustomer);
gymRouter.delete('/',verifyAccessToken, gym_controller.deleteCustomer);
gymRouter.patch('/',verifyAccessToken,validateCustomerMiddleware, gym_controller.UpdateCustomer);
