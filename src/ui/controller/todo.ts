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

interface TodoControllerCreateParams {
  content?: string;
  onError: () => void;
  onSuccess: (todo: any) => void;
}

function create({ content, onError, onSuccess }: TodoControllerCreateParams) {
  if (!content) {
    onError();
    return;
  }

  const todo = {
    id: "212175362",
    content,
    date: new Date(),
    done: false,
  };

  onSuccess(todo);
}

export const todoController = {
  get,
  filterTodosByContent,
  create,
};
