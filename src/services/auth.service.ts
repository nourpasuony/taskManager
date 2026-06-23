import mongoose, { Types } from "mongoose";
import { UserModel } from "../models/user.model.js";
import { NotFoundError, UnauthorizedError } from "../utiles/app-error.js";
import { LoginInputType , RegisterInputType } from "../validations/auth.validator.js";
import { signAccessToken } from "../utiles/jwt.js";
import { RoleEnum } from "../enums/role.enum.js";


export const registerService = async (body: RegisterInputType) => {
  const { email } = body;

  const ExistingUser = await UserModel.findOne({ email });
  if (ExistingUser) {
    throw new UnauthorizedError("User already exists");
  }
  const newUser = new UserModel({ 
    ...body,
    role: RoleEnum.MEMBER 
  });
  await newUser.save();
  const savedUser = newUser.omitPassword();
  return { user: savedUser };
};


export const loginService = async (body: LoginInputType) => {
  const { email, password } = body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new NotFoundError("Email or password is incorrect");
  }
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Email or password is incorrect");
  }
  const { token, expiresAt } = signAccessToken({ userId: user._id.toString() });

  // const reportSetting = await ReportSettingModel.findOne(
  //   {
  //     userId: new Types.ObjectId(user._id),
  //   },
  //   {
  //     _id: 1,
  //     frequency: 1,
  //     isEnabled: 1,
  //   }
  // ).lean();

  return {
    user: user.omitPassword(),
    accessToken: token,
    expiresAt,

  };
};
