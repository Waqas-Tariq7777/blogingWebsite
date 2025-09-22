import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import userRoutes from "./routes/user.routes.js"
import { ApiError } from "./utils/ApiError.js";
import adminRoutes from "./routes/admin.routes.js"
import commentRoutes from "./routes/comment.routes.js"
import testRouter from "./routes/test.routes.js";
const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        // allow requests with no origin (like mobile apps, curl)
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/user", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/comment", commentRoutes)
app.use(testRouter)


app.use((err, req, res, next) => {
  console.error(err.stack)
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});
export { app }