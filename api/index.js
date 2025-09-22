import dotenv from "dotenv";
import connectDB from "./db/index.js";
import serverless from "serverless-http";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

// connect to DB (optional: wrap in try/catch)
await connectDB();

export default handler = serverless(app);
