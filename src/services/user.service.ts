import { UserModel } from "../models/user.model.js";
import { NotFoundError } from "../utiles/app-error.js";

export const findUserByIdService = async (userId: string) => {
  if (!userId) {
    throw new NotFoundError("User ID is required");
  }
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user.omitPassword();
};
