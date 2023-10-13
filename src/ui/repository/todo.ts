interface TodoRepositoryGetParams {
  page: number;
  limit: number;
}

interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

function get({
  page,
  limit,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> {
  return fetch("/api/todos").then(async (response) => {
    const todosString = await response.text();
    const { todos } = parseTodosFromServer(JSON.parse(todosString));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTodos = todos.slice(startIndex, endIndex);
    const pages = Math.ceil(todos.length / limit);

    return {
      todos: paginatedTodos,
      total: todos.length,
      pages,
    };
  });
}

export const todoRepository = {
  get,
};

// Model/Schema
interface Todo {
  id: string;
  content: string;
  date: Date;
  done: boolean;
}

function parseTodosFromServer(responseBody: unknown): { todos: Array<Todo> } {
  console.log(responseBody);

  if (
    responseBody !== null &&
    typeof responseBody === "object" &&
    "todos" in responseBody &&
    Array.isArray(responseBody.todos)
  ) {
    return {
      todos: responseBody.todos.map((todo: unknown) => {
        if (todo === null && typeof todo !== "object") {
          throw new Error("Invalid todo from API");
        }

        const { id, content, done, date } = todo as {
          id: string;
          content: string;
          date: string;
          done: string;
        };

        return {
          id,
          content,
          done: String(done).toLowerCase() === "true",
          date: new Date(date),
        };
      }),
    };
  }

  return {
    todos: [],
  };
}
