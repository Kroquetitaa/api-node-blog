import { Schema, model } from "mongoose";
import { Posts, PostsModel, UserModel } from "../interfaces";

const PostsSchemaField: Record<keyof Posts, any> = {
    title: { type: String, required: true },
    content: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    published: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
}

const PostsSchema = new Schema<PostsModel>(PostsSchemaField);

const PostsModel = model<PostsModel>("Post", PostsSchema, "posts");

export default PostsModel;
