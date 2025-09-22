import dotenv from "dotenv";
import connectDB from "./db/index.js";
import serverless from "serverless-http";
import app from "./app.js";   // <-- default import

dotenv.config({ path: "./.env" });

await connectDB();

export default serverless(app);   // <-- default export must be a function
