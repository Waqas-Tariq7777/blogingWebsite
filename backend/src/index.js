import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config();

await connectDB();

// export app for Vercel
export default app;
