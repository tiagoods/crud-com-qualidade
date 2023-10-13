import { NextApiRequest, NextApiResponse } from "next";
import { read } from "@crud";

function get(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    todos: read(),
  });
}

export const todoController = {
  get,
};
