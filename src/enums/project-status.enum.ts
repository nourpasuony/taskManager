export const ProjectStatusEnum = {
  ACTIVE: "active",
  ARCHIVED: "archived",
  ON_HOLD: "on_hold",
} as const;

export type ProjectStatusType = typeof ProjectStatusEnum[keyof typeof ProjectStatusEnum];
