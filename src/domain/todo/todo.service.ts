import { v4 as uuidv4 } from "uuid";

import type { Category, Todo, Tag, TodoDisplay } from "./todo.entity";
import { loadCategories, loadTodos, saveCategories, saveTodos, loadTags, saveTags } from "./todo.repository";

const todoIndexFor = (id: string | number, todos: Todo[]) => {
  let index = typeof id === "number" ? id - 1 : todos.findIndex((todo) => todo.id === id);
  if (typeof id === "string" && index === -1 && !/^([0-9a-fA-F\-]{36})$/.test(id)) {
    const num = parseInt(id, 10);
    if (!isNaN(num) && num >= 1 && num <= todos.length) {
      index = num - 1;
    }
  }
  return index;
};

const addCategory = (category: string) => {
  const categories = loadCategories();
  const id = uuidv4();
  const newCategory: Category = {
    id,
    name: category,
  };
  categories.push(newCategory);
  saveCategories(categories);
  return newCategory;
};

const getCategoryId = (categoryName: string) => {
  const categories = loadCategories();
  const category = categories.find((c) => c.name === categoryName);
  return category?.id;
};

const getTagId = (tagName: string) => {
  const tags = loadTags();
  const tag = tags.find((t) => t.name === tagName);
  return tag?.id;
};

const isExistCategory = (category: string) => {
  const categories = loadCategories();
  return categories.some((c) => c.name === category);
};

const isExistTag = (tag: string) => {
  const tags = loadTags();
  return tags.some((t) => t.name === tag);
};

const addTag = (tag: string) => {
  const tags = loadTags();
  const newTag: Tag = {
    id: uuidv4(),
    name: tag,
  };
  tags.push(newTag);
  saveTags(tags);
  return newTag;
};

export function addTodo({ title, description, category, tags }: Partial<Todo>): Todo {
  const todos = loadTodos();

  let categoryId: string | undefined;
  if (category) {
    const existedCategoryId = getCategoryId(category);
    if (!existedCategoryId) {
      categoryId = addCategory(category).id;
    } else {
      categoryId = existedCategoryId;
    }
  }

  let tagIds: string[] = [];
  if (tags) {
    tags.forEach((tag) => {
      const existedTagId = getTagId(tag);
      if (!existedTagId) {
        tagIds.push(addTag(tag).id);
      } else {
        tagIds.push(existedTagId);
      }
    });
  }

  const newTodo: Todo = {
    id: uuidv4(),
    title: title!,
    description,
    category: categoryId,
    tags: tagIds,
    done: false,
    createdAt: new Date(),
  };
  todos.push(newTodo);
  saveTodos(todos);
  return newTodo;
}

export function listTodos({ category, tag, done }: { category?: string; tag?: string; done?: boolean } = {}): TodoDisplay[] {
  const todos = loadTodos();
  const categories = loadCategories();
  const tags = loadTags();
  return todos
    .filter((todo) => {
      if (category && categories.find((c) => c.id === todo.category)?.name !== category) return false;
      if (tag && !tags.some((t) => todo.tags?.includes(t.id) && t.name === tag)) return false;
      if (done !== undefined && todo.done !== done) return false;
      return true;
    })
    .map((todo) => ({
      ...todo,
      category: categories.find((c) => c.id === todo.category)?.name,
      tags: todo.tags?.map((tagId) => tags.find((t) => t.id === tagId)?.name).filter((t) => t !== undefined) as string[],
    }));
}

export function updateTodo(id: string, { description, category, tags }: Partial<Todo>): Todo | null {
  const todos = loadTodos();
  const index = todoIndexFor(id, todos);

  if (index === -1) return null;
  if (description !== undefined) todos[index].description = description;
  if (category !== undefined) {
    const existedCategoryId = getCategoryId(category);
    if (!existedCategoryId) {
      todos[index].category = addCategory(category).id;
    } else {
      todos[index].category = existedCategoryId;
    }
  }
  if (tags !== undefined) {
    todos[index].tags = [];
    tags.forEach((tag) => {
      const existedTagId = getTagId(tag);
      if (!existedTagId) {
        todos[index].tags?.push(addTag(tag).id);
      } else {
        todos[index].tags?.push(existedTagId);
      }
    });
  }
  todos[index].updatedAt = new Date();
  saveTodos(todos);
  return todos[index];
}

export function deleteTodo(id: string): boolean {
  const todos = loadTodos();
  const index = todoIndexFor(id, todos);

  if (index === -1) return false;
  todos.splice(index, 1);
  saveTodos(todos);
  return true;
}

export function doneTodo(id: string | number): Todo | null {
  const todos = loadTodos();
  const index = todoIndexFor(id, todos);
  if (index === -1 || index >= todos.length) return null;
  todos[index].done = true;
  todos[index].updatedAt = new Date();
  saveTodos(todos);
  return todos[index];
}

export function listCategories(): string[] {
  const categories = loadCategories();
  const categoryNames = new Set<string>();
  categories.forEach((category) => {
    categoryNames.add(category.name);
  });
  return Array.from(categoryNames);
}

export function listTags(): string[] {
  const tags = loadTags();
  const tagNames = new Set<string>();
  tags.forEach((tag) => {
    tagNames.add(tag.name);
  });
  return Array.from(tagNames);
}
