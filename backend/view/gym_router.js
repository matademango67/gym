import { Router } from "express";
import { gym_controller } from "../controller/gym_controller.js";

export const gymRouter = Router();

gymRouter.get('/', gym_controller.getCustomers);
gymRouter.get('/:search', gym_controller.SearchCustomer);
gymRouter.post('/', gym_controller.createCustomer);
gymRouter.delete('/', gym_controller.deleteCustomer);
gymRouter.put('/:id', gym_controller.UpdateCustomer);
