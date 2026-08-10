import dotenv from "dotenv";
import './jobs/membershipJob.js';
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const { connectDB } = await import("./db/gym.js");

connectDB();

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
}); 