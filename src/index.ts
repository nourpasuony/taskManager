import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { Env } from "./config/env.config.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import authRoutes from "./routes/auth.route.js";
import { BadRequestError } from "./utiles/app-error.js";
import { asyncHandler } from "./middlewares/asyncHandler.middleware.js";
import connectDB from "./config/database.config.js";
import userRoutes from "./routes/user.route.js";
import projectRoutes from "./routes/project.route.js";
import taskRoutes from "./routes/task.route.js";


const app = express();
const BASE_PATH = Env.BASE_PATH;
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [Env.FRONTEND_ORIGIN, "http://localhost:5174", "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Routes
app.get(
  `/`,
  asyncHandler((req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestError("Test error handling");
  })
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, userRoutes);
app.use(`${BASE_PATH}/projects`, projectRoutes);
app.use(`${BASE_PATH}/projects/:projectId/tasks`, taskRoutes);


app.use(errorHandler);

app.listen(Env.PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
});
