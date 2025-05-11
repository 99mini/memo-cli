export interface Todo {
  id: string;
  title: string;
  description?: string;
  /** category id */
  category?: string;
  /** tag id list */
  tags?: string[];
  done: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface TodoDisplay extends Todo {
  /** category name */
  category?: string;
  /** tag name list */
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}
