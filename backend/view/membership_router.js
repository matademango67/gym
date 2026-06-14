import { Router } from "express";
import { gym_membership } from "../controller/gym/membership_controller.js";
import { validateMembershipMiddleware  } from "../middleware/gym_validation.js";

export const MembershipRouter = Router();

MembershipRouter.post('/',validateMembershipMiddleware , gym_membership.create_membership);