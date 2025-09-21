import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import { ApiError } from "./utils/ApiError.js";

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, cb) =>
      !origin || allowedOrigins.includes(origin)
        ? cb(null, true)
        : cb(new Error("Not allowed by CORS")),
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/comment", commentRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

export default app;
