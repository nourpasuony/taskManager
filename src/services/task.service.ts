import { TaskModel } from "../models/task.model.js";
import { ProjectModel } from "../models/project.model.js";
import { NotFoundError, BadRequestError } from "../utiles/app-error.js";
import {
  CreateTaskInputType,
  UpdateTaskInputType,
} from "../validations/task.validator.js";
import {
  PaginationInputType,
  calculatePagination,
} from "../validations/pagination.validator.js";

export const createTaskService = async (
  projectId: string,
  userId: string,
  body: CreateTaskInputType
) => {
  // Verify project belongs to user
  const project = await ProjectModel.findOne({
    _id: projectId,
    userId,
  });
  if (!project) {
    throw new NotFoundError("Project not found");
  }

  const task = new TaskModel({
    ...body,
    dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
    projectId,
  });
  await task.save();
  return task;
};

export const getTasksService = async (
  projectId: string,
  userId: string,
  filters?: { status?: string; priority?: string },
  pagination?: PaginationInputType
) => {
  // Verify project belongs to user
  const project = await ProjectModel.findOne({
    _id: projectId,
    userId,
  });
  if (!project) {
    throw new NotFoundError("Project not found");
  }

  const query: any = { projectId };
  if (filters?.status) query.status = filters.status;
  if (filters?.priority) query.priority = filters.priority;

  const { page = 1, limit = 10 } = pagination || {};

  // Get total count
  const total = await TaskModel.countDocuments(query);

  // Calculate pagination
  const { skip, ...paginationData } = calculatePagination(page, limit, total);

  // Get paginated results
  const tasks = await TaskModel.find(query)
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    tasks,
    pagination: paginationData,
  };
};

export const getTaskByIdService = async (
  taskId: string,
  projectId: string,
  userId: string
) => {
  // Verify project belongs to user
  const project = await ProjectModel.findOne({
    _id: projectId,
    userId,
  });
  if (!project) {
    throw new NotFoundError("Project not found");
  }

  const task = await TaskModel.findOne({
    _id: taskId,
    projectId,
  });
  if (!task) {
    throw new NotFoundError("Task not found");
  }
  return task;
};

export const updateTaskService = async (
  taskId: string,
  projectId: string,
  userId: string,
  body: UpdateTaskInputType
) => {
  // Verify project belongs to user
  const project = await ProjectModel.findOne({
    _id: projectId,
    userId,
  });
  if (!project) {
    throw new NotFoundError("Project not found");
  }

  const updateData = {
    ...body,
    dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
  };

  const task = await TaskModel.findOneAndUpdate(
    { _id: taskId, projectId },
    updateData,
    { new: true }
  );
  if (!task) {
    throw new NotFoundError("Task not found");
  }
  return task;
};

export const deleteTaskService = async (
  taskId: string,
  projectId: string,
  userId: string
) => {
  // Verify project belongs to user
  const project = await ProjectModel.findOne({
    _id: projectId,
    userId,
  });
  if (!project) {
    throw new NotFoundError("Project not found");
  }

  const task = await TaskModel.findOneAndDelete({
    _id: taskId,
    projectId,
  });
  if (!task) {
    throw new NotFoundError("Task not found");
  }
  return task;
};
