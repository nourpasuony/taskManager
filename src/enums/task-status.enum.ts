export const TaskStatusEnum = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  DONE: "done",
} as const;

export type TaskStatusType = typeof TaskStatusEnum[keyof typeof TaskStatusEnum];
