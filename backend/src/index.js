import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config();

await connectDB(); // run once when function is loaded
export default app; // no app.listen()!
