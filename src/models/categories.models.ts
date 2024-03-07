import { Schema, model } from "mongoose";
import { Categories, CategoriesModel,} from "../interfaces";

const CategoriesSchemaField: Record<keyof Categories, any> = {
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  published:{ type: Boolean, default: false },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }]
};

const CategoriesSchema = new Schema<CategoriesModel>(CategoriesSchemaField);

const CategoriesModel = model<CategoriesModel>("Categorie", CategoriesSchema, "categories");

export default CategoriesModel;
