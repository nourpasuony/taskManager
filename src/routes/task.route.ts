import { Router } from "express";
import {
  createTaskController,
  deleteTaskController,
  getTaskByIdController,
  getTasksController,
  updateTaskController,
} from "../controllers/task.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const taskRoutes = Router({ mergeParams: true });

// All routes require authentication
taskRoutes.use(authMiddleware);

// GET all tasks for a specific project (with optional filters)
taskRoutes.get("/", getTasksController);

// POST create a task under a project
taskRoutes.post("/", createTaskController);

// GET a single task by ID
taskRoutes.get("/:taskId", getTaskByIdController);

// PUT update task (including status)
taskRoutes.put("/:taskId", updateTaskController);

// DELETE a task
taskRoutes.delete("/:taskId", deleteTaskController);

export default taskRoutes;
