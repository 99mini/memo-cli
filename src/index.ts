import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { saveTodos, loadTodos } from "./storage";
import { Todo } from "./types";
import * as uuid from "uuid";

yargs(hideBin(process.argv))
  .command(
    "add <title>",
    "Add new todo",
    (yargs) => {
      return yargs
        .positional("title", { type: "string" })
        .option("desc", { alias: "d", type: "string" })
        .option("category", { alias: "c", type: "string" })
        .option("tags", { alias: "t", type: "array" });
    },
    (argv) => {
      if (!argv.title) {
        console.log("Title is required");
        return;
      }

      const todos = loadTodos();
      const newTodo: Todo = {
        id: uuid.v4(),
        title: argv.title,
        description: argv.desc,
        category: argv.category,
        tags: argv.tags,
        done: false,
        createdAt: new Date(),
      };
      todos.push(newTodo);
      saveTodos(todos);
    }
  )
  .command(
    "list",
    "Show todos",
    {
      category: { type: "string" },
      tag: { type: "string" },
      done: { type: "boolean" },
    },
    (argv) => {
      const todos = loadTodos();
      const filteredTodos = todos.filter((todo) => {
        if (argv.category && todo.category !== argv.category) {
          return false;
        }
        if (argv.tag && todo.tags && !todo.tags.includes(argv.tag)) {
          return false;
        }
        if (argv.done !== undefined && todo.done !== argv.done) {
          return false;
        }
        return true;
      });
      if (argv.category) {
        console.log(`📋 할 일 목록 (카테고리: ${argv.category})`);
      } else {
        console.log("📋 할 일 목록");
      }
      if (filteredTodos.length === 0) {
        console.log("  (비어있음)");
        return;
      }
      filteredTodos.forEach((todo, idx) => {
        const check = todo.done ? "[x]" : "[ ]";
        const tagStr = todo.tags && todo.tags.length > 0 ? ` (태그: ${todo.tags.join(", ")})` : "";
        console.log(`${check} ${idx + 1}. ${todo.title}${tagStr}`);
      });
    }
  )
  .command(
    "update <id>",
    "Update todo",
    (yargs) => {
      return yargs
        .positional("id", { type: "string" })
        .option("desc", { alias: "d", type: "string" })
        .option("category", { alias: "c", type: "string" })
        .option("tags", { alias: "t", type: "array" });
    },
    (argv) => {
      const todos = loadTodos();
      const index = todos.findIndex((todo) => todo.id === argv.id);
      if (index === -1) {
        console.log("Todo not found");
        return;
      }
      todos[index].description = argv.desc;
      todos[index].category = argv.category;
      todos[index].tags = argv.tags;
      todos[index].updatedAt = new Date();
      saveTodos(todos);
    }
  )
  .command(
    "delete <id>",
    "Delete todo",
    (yargs) => {
      return yargs.positional("id", { type: "string" });
    },
    (argv) => {
      const todos = loadTodos();
      const index = todos.findIndex((todo) => todo.id === argv.id);
      if (index === -1) {
        console.log("Todo not found");
        return;
      }
      todos.splice(index, 1);
      saveTodos(todos);
    }
  )
  .command(
    "done <id>",
    "Mark todo as done",
    (yargs) => {
      return yargs.positional("id", { type: "string" });
    },
    (argv) => {
      const { id } = argv;
      if (!id) {
        console.log("ID is required");
        return;
      }
      const todos = loadTodos();
      let index = todos.findIndex((todo) => todo.id === id);
      // id가 uuid가 아니면 번호로 간주
      if (index === -1 && !/^([0-9a-fA-F\-]{36})$/.test(id)) {
        const num = parseInt(id, 10);
        if (!isNaN(num) && num >= 1 && num <= todos.length) {
          index = num - 1;
        }
      }
      if (index === -1 || index >= todos.length) {
        console.log("Todo not found");
        return;
      }
      todos[index].done = true;
      todos[index].updatedAt = new Date();
      saveTodos(todos);
    }
  )
  .parse();
