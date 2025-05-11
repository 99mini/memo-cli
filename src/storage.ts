import { Todo } from "./types";
import fs from "fs";

const DATA_PATH = "./todo-data.json";

export const loadTodos = (): Todo[] => {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  } catch {
    return [];
  }
};

export const saveTodos = (todos: Todo[]) => {
  fs.writeFileSync(DATA_PATH, JSON.stringify(todos, null, 2));
};

export const updateTodo = (id: string, updatedTodo: Todo) => {
  const todos = loadTodos();
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    return;
  }
  todos[index] = updatedTodo;
  saveTodos(todos);
};
