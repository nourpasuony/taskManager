import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Task title must be at least 3 characters long")
    .max(100, "Task title must be at most 100 characters long"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters long")
    .optional(),
  priority: z
    .enum(["low", "medium", "high", "urgent"])
    .optional()
    .default("medium"),
  dueDate: z.string().datetime().optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Task title must be at least 3 characters long")
    .max(100, "Task title must be at most 100 characters long")
    .optional(),
  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters long")
    .optional(),
  status: z
    .enum(["pending", "in_progress", "done"])
    .optional(),
  priority: z
    .enum(["low", "medium", "high", "urgent"])
    .optional(),
  dueDate: z.string().datetime().optional(),
});

export type CreateTaskInputType = z.infer<typeof createTaskSchema>;
export type UpdateTaskInputType = z.infer<typeof updateTaskSchema>;
