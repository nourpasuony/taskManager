import { UserDocument } from "../models/user.model.js";
import type { RoleType } from "../enums/role.enum.js";

declare global {
  namespace Express {
    interface User extends UserDocument {
      _id: string;
      role: RoleType;
    }
  }
}
