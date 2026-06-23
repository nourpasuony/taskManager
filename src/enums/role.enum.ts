export const RoleEnum = {
  ADMIN: "admin",
  MEMBER: "member",
} as const;

export type RoleType = typeof RoleEnum[keyof typeof RoleEnum];
