import { Router } from "express";
import { paymentController } from "../controller/gym/payment_controller.js";
import {verifyAccess} from "../middleware/verifyAccess.js";
import {verifyAccessToken} from "../middleware/accesstoken_validation.js";
export const PaymentRouter = Router();

PaymentRouter.get('/' ,verifyAccessToken,paymentController.get_mypayments )
PaymentRouter.post('/' , verifyAccessToken, verifyAccess , paymentController.create_payment)
