import mongoose, { Schema, Document } from "mongoose";
import { TaskStatusType } from "../enums/task-status.enum.js";
import { TaskPriorityType } from "../enums/task-priority.enum.js";

export interface TaskDocument extends Document {
  _id: string;
  title: string;
  description: string;
  status: TaskStatusType;
  priority: TaskPriorityType;
  dueDate: Date;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<TaskDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "in_progress", "done"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    dueDate: { type: Date },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  { timestamps: true }
);

export const TaskModel = mongoose.model<TaskDocument>("Task", taskSchema);
