export const TaskPriorityEnum = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export type TaskPriorityType = typeof TaskPriorityEnum[keyof typeof TaskPriorityEnum];
