import { Router } from "express";
import { gym_membership } from "../controller/gym/membership_controller.js";
import { validateMembershipMiddleware  } from "../middleware/gym_validation.js";
import {verifyAccessToken} from "../middleware/accesstoken_validation.js";

export const MembershipRouter = Router();

MembershipRouter.get('/', gym_membership.get_memberships);
MembershipRouter.get('/me',verifyAccessToken, gym_membership.search_memberships);
MembershipRouter.post('/',verifyAccessToken, validateMembershipMiddleware , gym_membership.create_membership);
MembershipRouter.patch('/status',verifyAccessToken , gym_membership.changeStatus_membership)
MembershipRouter.patch('/type',verifyAccessToken , gym_membership.changeType_membership)
