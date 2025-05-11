import { Todo } from "../todo.entity";

export const todoIndexFor = (id: string | number, todos: Todo[]) => {
  let index = typeof id === "number" ? id - 1 : todos.findIndex((todo) => todo.id === id);
  if (typeof id === "string" && index === -1 && !/^([0-9a-fA-F\-]{36})$/.test(id)) {
    const num = parseInt(id, 10);
    if (!isNaN(num) && num >= 1 && num <= todos.length) {
      index = num - 1;
    }
  }
  return index;
};
