import mongoose, { Schema } from "mongoose";
import { compareValue, hashValue } from "../utiles/bcrypt.js";
import { RoleType, RoleEnum } from "../enums/role.enum.js";

export interface UserDocument extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: RoleType;
  comparePassword: (password: string) => Promise<boolean>;
  omitPassword: () => Omit<
    UserDocument,
    | "password"
    | "resetPasswordToken"
    | "resetPasswordExpires"
    | "twoFactorSecret"
  >;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: true },
    role: { type: String, enum: ["admin", "member"], default: "member" },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    if (this.password) {
      this.password = await hashValue(this.password);
    }
  }
});

userSchema.methods.omitPassword = function (): Omit<
  UserDocument,
  "password" | "resetPasswordToken" | "resetPasswordExpires" | "twoFactorSecret"
> {
  const user = this.toObject();
  delete user.password;
  return user;
};

userSchema.methods.comparePassword = async function (password: string) {
  return compareValue(password, this.password);
};

export const UserModel = mongoose.model<UserDocument>("User", userSchema);
