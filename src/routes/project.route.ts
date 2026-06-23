import { Router } from "express";
import {
  createProjectController,
  deleteProjectController,
  getProjectByIdController,
  getProjectsController,
  updateProjectController,
} from "../controllers/project.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const projectRoutes = Router();

// All routes require authentication
projectRoutes.use(authMiddleware);

// GET all projects for authenticated user
projectRoutes.get("/", getProjectsController);

// POST create a new project
projectRoutes.post("/", createProjectController);

// GET a single project by ID
projectRoutes.get("/:projectId", getProjectByIdController);

// PUT update project details
projectRoutes.put("/:projectId", updateProjectController);

// DELETE a project
projectRoutes.delete("/:projectId", deleteProjectController);

export default projectRoutes;
