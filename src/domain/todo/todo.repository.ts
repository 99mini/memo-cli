import fs from "fs";
import path from "path";
import { Todo } from "./todo.entity";

const DATA_PATH = path.resolve(__dirname, "../../../todo-data.json");

export function loadTodos(): Todo[] {
  if (!fs.existsSync(DATA_PATH)) return [];
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  const arr = JSON.parse(raw);
  return arr.map((t: any) => ({ ...t, createdAt: new Date(t.createdAt), updatedAt: t.updatedAt ? new Date(t.updatedAt) : undefined }));
}

export function saveTodos(todos: Todo[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(todos, null, 2), "utf-8");
}
