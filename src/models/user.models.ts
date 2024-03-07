import { Schema, model } from "mongoose";
import { User, UserModel } from "../interfaces";

const UserSchemaField: Record<keyof User, any> = {
  email: { type: String, required: true },
  password: { type: String, required: true },
  first_name: { type: String, minlength: 5, maxlength: 80 },
  last_name: { type: String, minlength: 5, maxlength: 80 },
  created_at: { type: Date, default: Date.now },
};

const UserSchema = new Schema<UserModel>(UserSchemaField);

const UserModel = model<UserModel>("User", UserSchema, "users");

export default UserModel;
