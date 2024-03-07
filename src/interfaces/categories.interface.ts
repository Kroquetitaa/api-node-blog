import Type from 'mongoose'

export interface Categories {
    title: string;
    slug: string;
    published?: boolean;
    posts: Type.ObjectId;
  }
  
export interface CategoriesModel extends Categories, Document {}
  