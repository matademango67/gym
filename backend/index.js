import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const { gymRouter } = await import("./view/gym_router.js");
const { authRouter } = await import("./view/auth_router.js");
const {MembershipRouter} = await import("./view/membership_router.js")

const app = express();
const PORT = process.env.PORT || 3000;

const { connectDB } = await import("./db/gym.js");

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/', gymRouter);
app.use('/membership',MembershipRouter)


app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
}); 