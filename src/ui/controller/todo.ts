import { todoRepository } from "@ui/repository/todo";

interface TodoControllerGetParams {
  page: number;
}

async function get({ page }: TodoControllerGetParams) {
  return todoRepository.get({
    page,
    limit: 2,
  });
}

function filterTodosByContent<Todo>(
  search: string,
  todos: Array<Todo & { content: string }>
): Todo[] {
  return todos.filter((todo) =>
    todo.content.toLowerCase().includes(search.toLowerCase())
  );
}

export const todoController = {
  get,
  filterTodosByContent,
};
