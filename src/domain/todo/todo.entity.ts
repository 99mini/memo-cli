export interface Todo {
  id: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  done: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
