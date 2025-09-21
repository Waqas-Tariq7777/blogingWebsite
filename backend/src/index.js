import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config();

await connectDB(); // run once

// export default app;   // <-- only this export
// backend/src/index.js
export default (req, res) => {
  res.status(200).json({ ok: true });
};
