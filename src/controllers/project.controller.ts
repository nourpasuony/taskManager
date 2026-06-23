import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { httpStatus } from "../config/http.config.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validations/project.validator.js";
import {
  paginationSchema,
} from "../validations/pagination.validator.js";
import {
  createProjectService,
  deleteProjectService,
  getProjectByIdService,
  getProjectsService,
  updateProjectService,
} from "../services/project.service.js";

export const createProjectController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const body = createProjectSchema.parse(req.body);
    const project = await createProjectService(userId, body);

    return res.status(httpStatus.CREATED).json({
      message: "Project created successfully",
      project,
    });
  }
);

export const getProjectsController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const paginationData = paginationSchema.parse({ page, limit });

    const { projects, pagination } = await getProjectsService(
      userId,
      {
        page: paginationData.page || 1,
        limit: paginationData.limit || 10,
      }
    );

    return res.status(httpStatus.OK).json({
      message: "Projects retrieved successfully",
      projects,
      pagination,
    });
  }
);

export const getProjectByIdController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const projectId = req.params.projectId as string;
    if (!projectId) {
      throw new Error("Project ID is required");
    }
    const project = await getProjectByIdService(projectId, userId);

    return res.status(httpStatus.OK).json({
      message: "Project retrieved successfully",
      project,
    });
  }
);

export const updateProjectController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const projectId = req.params.projectId as string;
    if (!projectId) {
      throw new Error("Project ID is required");
    }
    const body = updateProjectSchema.parse(req.body);
    const project = await updateProjectService(projectId, userId, body);

    return res.status(httpStatus.OK).json({
      message: "Project updated successfully",
      project,
    });
  }
);

export const deleteProjectController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const projectId = req.params.projectId as string;
    if (!projectId) {
      throw new Error("Project ID is required");
    }
    const project = await deleteProjectService(projectId, userId);

    return res.status(httpStatus.OK).json({
      message: "Project deleted successfully",
      project,
    });
  }
);
