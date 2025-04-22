// In lib/types.ts
import { ObjectId } from "mongodb";

export interface Task {
  _id: ObjectId; // instead of string
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
