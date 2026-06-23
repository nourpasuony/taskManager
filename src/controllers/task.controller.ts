import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { httpStatus } from "../config/http.config.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validations/task.validator.js";
import {
  paginationSchema,
} from "../validations/pagination.validator.js";
import {
  createTaskService,
  deleteTaskService,
  getTaskByIdService,
  getTasksService,
  updateTaskService,
} from "../services/task.service.js";

export const createTaskController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const projectId = req.params.projectId as string;
    if (!projectId) {
      throw new Error("Project ID is required");
    }
    const body = createTaskSchema.parse(req.body);
    const task = await createTaskService(projectId, userId, body);

    return res.status(httpStatus.CREATED).json({
      message: "Task created successfully",
      task,
    });
  }
);

export const getTasksController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const projectId = req.params.projectId as string;
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const { status, priority, page, limit } = req.query;

    const paginationData = paginationSchema.parse({
      page: page || 1,
      limit: limit || 10,
    });

    const { tasks, pagination } = await getTasksService(
      projectId,
      userId,
      {
        status: status as string,
        priority: priority as string,
      },
      {
        page: paginationData.page || 1,
        limit: paginationData.limit || 10,
      }
    );

    return res.status(httpStatus.OK).json({
      message: "Tasks retrieved successfully",
      tasks,
      pagination,
    });
  }
);

export const getTaskByIdController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const projectId = req.params.projectId as string;
    const taskId = req.params.taskId as string;
    if (!projectId || !taskId) {
      throw new Error("Project ID and Task ID are required");
    }
    const task = await getTaskByIdService(taskId, projectId, userId);

    return res.status(httpStatus.OK).json({
      message: "Task retrieved successfully",
      task,
    });
  }
);

export const updateTaskController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const projectId = req.params.projectId as string;
    const taskId = req.params.taskId as string;
    if (!projectId || !taskId) {
      throw new Error("Project ID and Task ID are required");
    }
    const body = updateTaskSchema.parse(req.body);
    const task = await updateTaskService(taskId, projectId, userId, body);

    return res.status(httpStatus.OK).json({
      message: "Task updated successfully",
      task,
    });
  }
);

export const deleteTaskController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const projectId = req.params.projectId as string;
    const taskId = req.params.taskId as string;
    if (!projectId || !taskId) {
      throw new Error("Project ID and Task ID are required");
    }
    const task = await deleteTaskService(taskId, projectId, userId);

    return res.status(httpStatus.OK).json({
      message: "Task deleted successfully",
      task,
    });
  }
);
