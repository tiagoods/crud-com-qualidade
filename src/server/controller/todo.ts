import { todoRepository } from "@server/repository/todo";
import { NextApiRequest, NextApiResponse } from "next";

function get(req: NextApiRequest, res: NextApiResponse) {
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

  const { todos, pages, total } = todoRepository.get({
    page,
    limit,
  });

  res.status(200).json({
    pages,
    total,
    todos,
  });
}

export const todoController = {
  get,
};
