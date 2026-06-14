import { Router } from "express";
import { gym_controller } from "../controller/gym/gym_controller.js";
import { validateCustomerMiddleware } from "../middleware/gym_validation.js";

export const gymRouter = Router();

gymRouter.get('/', gym_controller.getCustomers);
gymRouter.get('/:search', gym_controller.SearchCustomer);
gymRouter.post('/',validateCustomerMiddleware, gym_controller.createCustomer);
gymRouter.delete('/', gym_controller.deleteCustomer);
gymRouter.patch('/:id',validateCustomerMiddleware, gym_controller.UpdateCustomer);
