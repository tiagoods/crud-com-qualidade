import { create, read, update } from "@crud";

interface TodoRepositoryGetParams {
  page?: number;
  limit?: number;
}

interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

function get({
  page,
  limit,
}: TodoRepositoryGetParams = {}): TodoRepositoryGetOutput {
  const currentPage = page || 1;
  const currentLimit = limit || 10;
  const todos = read().reverse();

  const startIndex = (currentPage - 1) * currentLimit;
  const endIndex = startIndex + currentLimit;
  const paginatedTodos = todos.slice(startIndex, endIndex);
  const pages = Math.ceil(todos.length / currentLimit);

  return {
    todos: paginatedTodos,
    total: todos.length,
    pages,
  };
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

export const todoRepository = {
  get,
  createByContent,
  toggleDone,
};

// Model/Schema
interface Todo {
  id: string;
  content: string;
  date: string;
  done: boolean;
}
