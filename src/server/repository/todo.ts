import { create, read, update, deleteById as removeById } from "@crud";
import { HttpNotFoundError } from "@server/infra/errors";

// ==============================================
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SECRET_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);
// ==============================================

interface TodoRepositoryGetParams {
  page?: number;
  limit?: number;
}

interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

async function get({
  page,
  limit,
}: TodoRepositoryGetParams = {}): Promise<TodoRepositoryGetOutput> {
  const { data, error, count } = await supabase.from("todos").select("*", {
    count: "exact",
  });

  if (error) throw new Error("Failed to fetch data");

  const todos = data as Todo[];
  const total = count || todos.length;

  return {
    todos,
    total,
    pages: 1,
  };

  // const currentPage = page || 1;
  // const currentLimit = limit || 10;
  // const todos = read().reverse();

  // const startIndex = (currentPage - 1) * currentLimit;
  // const endIndex = startIndex + currentLimit;
  // const paginatedTodos = todos.slice(startIndex, endIndex);
  // const pages = Math.ceil(todos.length / currentLimit);

  // return {
  //   todos: paginatedTodos,
  //   total: todos.length,
  //   pages,
  // };
}

async function createByContent(content: string): Promise<Todo> {
  return create(content);
}

async function toggleDone(id: string): Promise<Todo> {
  const todos = read();
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    throw new Error(`Todo with id "${id}" not found`);
  }

  return update(todo.id, {
    done: !todo.done,
  });
}

async function deleteById(id: string): Promise<void> {
  const todos = read();
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    throw new HttpNotFoundError(`Todo with id "${id}" not found`);
  }

  removeById(id);
}

export const todoRepository = {
  get,
  createByContent,
  toggleDone,
  deleteById,
};

// Model/Schema
interface Todo {
  id: string;
  content: string;
  date: string;
  done: boolean;
}
