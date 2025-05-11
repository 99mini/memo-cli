import fs from "fs";
import path from "path";
import os from "os";
import { Todo } from "./todo.entity";

const BASE_PATH = process.env.NODE_ENV === "development" ? "./data" : os.homedir();

const DATA_DIR = path.join(BASE_PATH, ".memo");
const DATA_PATH = path.join(DATA_DIR, "todo-data.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function loadTodos(): Todo[] {
  ensureDataDir();
  if (!fs.existsSync(DATA_PATH)) return [];
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  const arr = JSON.parse(raw);
  return arr.map((t: any) => ({ ...t, createdAt: new Date(t.createdAt), updatedAt: t.updatedAt ? new Date(t.updatedAt) : undefined }));
}

export function saveTodos(todos: Todo[]) {
  ensureDataDir();
  fs.writeFileSync(DATA_PATH, JSON.stringify(todos, null, 2), "utf-8");
}
