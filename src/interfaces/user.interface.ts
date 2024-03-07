export interface User {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  created_at?: Date;
}

export interface UserModel extends User, Document {}
