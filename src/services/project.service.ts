import { ProjectModel } from "../models/project.model.js";
import { NotFoundError } from "../utiles/app-error.js";
import {
  CreateProjectInputType,
  UpdateProjectInputType,
} from "../validations/project.validator.js";
import {
  PaginationInputType,
  calculatePagination,
} from "../validations/pagination.validator.js";

export const createProjectService = async (
  userId: string,
  body: CreateProjectInputType
) => {
  const project = new ProjectModel({
    ...body,
    userId,
  });
  await project.save();
  return project;
};

export const getProjectsService = async (
  userId: string,
  pagination: PaginationInputType
) => {
  const { page = 1, limit = 10 } = pagination;

  // Get total count
  const total = await ProjectModel.countDocuments({ userId });

  // Calculate pagination
  const { skip, ...paginationData } = calculatePagination(page, limit, total);

  // Get paginated results
  const projects = await ProjectModel.find({ userId })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    projects,
    pagination: paginationData,
  };
};

export const getProjectByIdService = async (projectId: string, userId: string) => {
  const project = await ProjectModel.findOne({ _id: projectId, userId });
  if (!project) {
    throw new NotFoundError("Project not found");
  }
  return project;
};

export const updateProjectService = async (
  projectId: string,
  userId: string,
  body: UpdateProjectInputType
) => {
  const project = await ProjectModel.findOneAndUpdate(
    { _id: projectId, userId },
    body,
    { new: true }
  );
  if (!project) {
    throw new NotFoundError("Project not found");
  }
  return project;
};

export const deleteProjectService = async (projectId: string, userId: string) => {
  const project = await ProjectModel.findOneAndDelete({
    _id: projectId,
    userId,
  });
  if (!project) {
    throw new NotFoundError("Project not found");
  }
  return project;
};
