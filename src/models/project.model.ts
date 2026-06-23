import mongoose, { Schema, Document } from "mongoose";
import { ProjectStatusType } from "../enums/project-status.enum.js";

export interface ProjectDocument extends Document {
  _id: string;
  title: string;
  description: string;
  status: ProjectStatusType;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<ProjectDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ["active", "archived", "on_hold"],
      default: "active",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const ProjectModel = mongoose.model<ProjectDocument>(
  "Project",
  projectSchema
);
