import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { addTodo, listTodos, updateTodo, deleteTodo, doneTodo, listCategories, listTags } from "@/domain/todo/todo.service";

import pkg from "../../../package.json";

yargs(hideBin(process.argv))
  .version(pkg.version)
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
      const todo = addTodo({
        title: argv.title as string,
        description: argv.desc as string,
        category: argv.category as string,
        tags: argv.tags as string[],
      });
      console.log(`✅ Added: ${argv.category ? `[${argv.category}] ` : ""}${todo.title}${argv.tags && argv.tags.length > 0 ? ` (태그: ${argv.tags.join(", ")})` : ""}`);
    }
  )
  .command(
    "list",
    "Show todos",
    {
      category: { alias: "c", type: "string" },
      tag: { alias: "t", type: "string" },
      done: { type: "boolean" },
    },
    (argv) => {
      const todos = listTodos({
        category: argv.category as string,
        tag: argv.tag as string,
        done: argv.done as boolean,
      });
      if (argv.category) {
        console.log(`📋 할 일 목록 (카테고리: ${argv.category})`);
      } else {
        console.log("📋 할 일 목록");
      }
      if (todos.length === 0) {
        console.log("  (비어있음)");
        return;
      }
      todos.forEach((todo, idx) => {
        const check = todo.done ? "[x]" : "[ ]";
        const tagStr = todo.tags && todo.tags.length > 0 ? ` (태그: ${todo.tags.join(", ")})` : "";
        const categoryName = todo.category ? `[${todo.category}] ` : "";
        console.log(`${check} ${idx + 1}. ${categoryName}${todo.title}${tagStr}`);
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
      const { id, desc, category, tags } = argv;
      if (!id) {
        console.log("ID is required");
        return;
      }
      // 번호 인덱스 지원
      let realId = id;
      if (!/^([0-9a-fA-F\-]{36})$/.test(id)) {
        const todos = listTodos();
        const num = parseInt(id, 10);
        if (!isNaN(num) && num >= 1 && num <= todos.length) {
          realId = todos[num - 1].id;
        }
      }
      const updated = updateTodo(realId, { description: desc as string, category: category as string, tags: tags as string[] });
      if (!updated) {
        console.log("Todo not found");
        return;
      }
      console.log(`✏️ Updated: ${updated.title}`);
    }
  )
  .command(
    "delete <id>",
    "Delete todo",
    (yargs) => {
      return yargs.positional("id", { type: "string" });
    },
    (argv) => {
      const { id } = argv;
      if (!id) {
        console.log("ID is required");
        return;
      }
      // 번호 인덱스 지원
      let realId = id;
      if (!/^([0-9a-fA-F\-]{36})$/.test(id)) {
        const todos = listTodos();
        const num = parseInt(id, 10);
        if (!isNaN(num) && num >= 1 && num <= todos.length) {
          realId = todos[num - 1].id;
        }
      }
      const ok = deleteTodo(realId);
      if (!ok) {
        console.log("Todo not found");
        return;
      }
      console.log("🗑️ Deleted");
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
      // 번호 인덱스 지원
      let realId = id;
      if (!/^([0-9a-fA-F\-]{36})$/.test(id)) {
        const todos = listTodos();
        const num = parseInt(id, 10);
        if (!isNaN(num) && num >= 1 && num <= todos.length) {
          realId = todos[num - 1].id;
        }
      }
      const done = doneTodo(realId);
      if (!done) {
        console.log("Todo not found");
        return;
      }
      console.log(`✅ Done: ${done.title}`);
    }
  )
  .command("categories", "Show categories", {}, (argv) => {
    const categories = listCategories();
    console.log("📋 할 일 카테고리 목록");
    if (categories.length === 0) {
      console.log("  (비어있음)");
      return;
    }
    categories.forEach((category, idx) => {
      console.log(`${idx + 1}. ${category}`);
    });
  })
  .command("tags", "Show tags", {}, (argv) => {
    const tags = listTags();
    console.log("📋 할 일 태그 목록");
    if (tags.length === 0) {
      console.log("  (비어있음)");
      return;
    }
    tags.forEach((tag, idx) => {
      console.log(`${idx + 1}. ${tag}`);
    });
  })

  .help()
  .parse();
