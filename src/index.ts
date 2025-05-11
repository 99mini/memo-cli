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
      console.log(filteredTodos);
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
      const todos = loadTodos();
      const index = todos.findIndex((todo) => todo.id === argv.id);
      if (index === -1) {
        console.log("Todo not found");
        return;
      }
      todos[index].done = true;
      todos[index].updatedAt = new Date();
      saveTodos(todos);
    }
  )
  .parse();
