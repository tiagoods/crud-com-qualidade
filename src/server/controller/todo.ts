import { NextApiRequest, NextApiResponse } from "next";
import { z as schema } from "zod";
import { todoRepository } from "@server/repository/todo";
import { HttpNotFoundError } from "@server/infra/errors";

async function get(req: NextApiRequest, res: NextApiResponse) {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  if (page && isNaN(page)) {
    res.status(400).json({
      error: {
        message: "`page` must be a number",
      },
    });
    return;
  }

  if (limit && isNaN(limit)) {
    res.status(400).json({
      error: {
        message: "`limit` must be a number",
      },
    });
    return;
  }

  const { todos, pages, total } = await todoRepository.get({
    page,
    limit,
  });

  res.status(200).json({
    pages,
    total,
    todos,
  });
}

const TodoCreateBodySchema = schema.object({
  content: schema.string(),
});

async function create(req: NextApiRequest, res: NextApiResponse) {
  const body = TodoCreateBodySchema.safeParse(req.body);

  if (!body.success) {
    res.status(400).json({
      error: {
        message: "You must provide a content to create a TODO",
        description: body.error,
      },
    });
    return;
  }

  try {
    const createdTodo = await todoRepository.createByContent(body.data.content);

    res.status(201).json({
      todo: createdTodo,
    });
  } catch {
    res.status(400).json({
      error: {
        message: "Failed to create TODO",
      },
    });
  }
}

async function toggleDone(req: NextApiRequest, res: NextApiResponse) {
  const todoId = req.query.id;

  if (!todoId || Array.isArray(todoId)) {
    res.status(400).json({
      error: {
        message: "You must provide a valid ID",
      },
    });
    return;
  }

  try {
    const updatedTodo = await todoRepository.toggleDone(todoId);

    res.status(200).json({
      todo: updatedTodo,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(404).json({
        error: err.message,
      });
    }
  }
}

async function deleteById(req: NextApiRequest, res: NextApiResponse) {
  const QuerySchema = schema.object({
    id: schema.string().uuid().min(1),
  });

  const parsedQuery = QuerySchema.safeParse(req.query);

  if (!parsedQuery.success) {
    res.status(400).json({
      error: {
        message: "A valid ID must be provided",
      },
    });
    return;
  }

  try {
    const id = parsedQuery.data.id;

    await todoRepository.deleteById(id);

    res.status(204).end();
  } catch (err) {
    if (err instanceof HttpNotFoundError) {
      return res.status(err.status).json({
        error: {
          message: err.message,
        },
      });
    }

    res.status(500).json({
      error: {
        message: "Internal Server Error",
      },
    });
  }
}

export const todoController = {
  get,
  create,
  toggleDone,
  deleteById,
};
