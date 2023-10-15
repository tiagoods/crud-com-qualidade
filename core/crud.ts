import fs from "fs";
import { v4 as uuid } from "uuid";

const DB_FILE_PATH = "./core/db";

// console.log("[CRUD]");

type UUID = string;

interface Todo {
  id: UUID;
  date: string;
  content: string;
  done: boolean;
}

export function create(content: string): Todo {
  const todo: Todo = {
    id: uuid(),
    date: new Date().toISOString(),
    content: content,
    done: false,
  };

  const todos: Array<Todo> = [...read(), todo];

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos,
      },
      null,
      2
    )
  );

  return todo;
}

export function read(): Array<Todo> {
  const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
  const db = JSON.parse(dbString || "{}");

  if (!db.todos) {
    return [];
  }

  return db.todos;
}

export function update(id: UUID, partialTodo: Partial<Todo>): Todo {
  let updatedTodo;
  const todos = read();

  todos.forEach((currentTodo) => {
    if (currentTodo.id === id) {
      updatedTodo = Object.assign(currentTodo, partialTodo);
    }
  });

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos,
      },
      null,
      2
    )
  );

  if (!updatedTodo) {
    throw new Error("Please, provide another ID.");
  }

  return updatedTodo;
}

function updateContentById(id: UUID, content: string): Todo {
  return update(id, {
    content,
  });
}

function deleteById(id: UUID) {
  const todos = read();

  const todosWithoutOne = todos.filter((currentTodo) => currentTodo.id !== id);

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos: todosWithoutOne,
      },
      null,
      2
    )
  );
}

function clear_db() {
  fs.writeFileSync(DB_FILE_PATH, "");
}

// [SIMULATION]
// clear_db();

// create("Primeira TODO");
// const secondTodo = create("Segunda TODO");
// update(secondTodo.id, {
//   content: "Segunda TODO com novo content",
// });
// updateContentById(secondTodo.id, "Atualizada!");
// create("Terceira TODO");
// create("Quarta TODO");
// deleteById(secondTodo.id);
// const todos = read();
// console.log(todos);
// console.log(todos.length);
