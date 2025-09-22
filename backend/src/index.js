import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

await connectDB();

// ✅ export the express app as default so Vercel can invoke it
export default app;
