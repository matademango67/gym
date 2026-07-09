import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors';

import './jobs/membershipJob.js';

dotenv.config();

const { gymRouter } = await import("./view/gym_router.js");
const { authRouter } = await import("./view/auth_router.js");
const {MembershipRouter} = await import("./view/membership_router.js")
const {PaymentRouter} = await import("./view/payment_router.js")
const {AdminRouter} = await import("./view/admin_router.js")

const app = express();
const PORT = process.env.PORT || 3000;

const { connectDB } = await import("./db/gym.js");

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use('/auth', authRouter);
app.use('/customer', gymRouter);
app.use('/membership',MembershipRouter);
app.use('/payments',PaymentRouter);
app.use('/admin',AdminRouter);


app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
}); 