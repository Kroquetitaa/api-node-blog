import Types from 'mongoose'
export interface User {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  created_at?: Date;
  categories: Types.ObjectId,
}

export interface UserModel extends User, Document {}
