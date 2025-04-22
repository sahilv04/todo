export interface Task {
  _id?: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
}

export interface User {
  _id?: string;
  email: string;
  password: string;
}
