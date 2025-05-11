export type Todo = {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  category?: string;
  tags?: (string | number)[];
  createdAt: Date;
  updatedAt?: Date;
};
