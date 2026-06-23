import { Router } from "express";
import { getCurrentUserConstoller } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const userRoutes = Router();

// Require authentication for all user routes
userRoutes.use(authMiddleware);

userRoutes.get("/current-user", getCurrentUserConstoller);

export default userRoutes;
