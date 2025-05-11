import { todoIndexFor } from "./lib/utils";
import { Todo } from "./todo.entity";
import { loadTodos, saveTodos } from "./todo.repository";
import { v4 as uuidv4 } from "uuid";

export function addTodo({ title, description, category, tags }: Partial<Todo>): Todo {
  const todos = loadTodos();
  const newTodo: Todo = {
    id: uuidv4(),
    title: title!,
    description,
    category,
    tags,
    done: false,
    createdAt: new Date(),
  };
  todos.push(newTodo);
  saveTodos(todos);
  return newTodo;
}

export function listTodos({ category, tag, done }: { category?: string; tag?: string; done?: boolean } = {}): Todo[] {
  const todos = loadTodos();
  return todos.filter((todo) => {
    if (category && todo.category !== category) return false;
    if (tag && todo.tags && !todo.tags.includes(tag)) return false;
    if (done !== undefined && todo.done !== done) return false;
    return true;
  });
}

export function updateTodo(id: string, { description, category, tags }: Partial<Todo>): Todo | null {
  const todos = loadTodos();
  const index = todoIndexFor(id, todos);

  if (index === -1) return null;
  if (description !== undefined) todos[index].description = description;
  if (category !== undefined) todos[index].category = category;
  if (tags !== undefined) todos[index].tags = tags;
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
