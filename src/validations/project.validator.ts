import { z } from "zod";

export const createProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Project title must be at least 3 characters long")
    .max(100, "Project title must be at most 100 characters long"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters long")
    .optional(),
});

export const updateProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Project title must be at least 3 characters long")
    .max(100, "Project title must be at most 100 characters long")
    .optional(),
  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters long")
    .optional(),
  status: z
    .enum(["active", "archived", "on_hold"])
    .optional(),
});

export type CreateProjectInputType = z.infer<typeof createProjectSchema>;
export type UpdateProjectInputType = z.infer<typeof updateProjectSchema>;
