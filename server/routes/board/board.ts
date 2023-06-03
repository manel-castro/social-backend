import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { NotAuthorizedError } from "../../common/errors/not-authorized-error";
import { validateRequest } from "../../common/middlewares/validate-request";
import { Board, BoardAttrs, BoardDoc } from "../../models/board";

const express = require("express");

const router = express.Router();

export const getBoardData = ({ board }: { board: BoardAttrs }) => {
  const { userId, likes, userName, postMessage } = board;

  return { userId, likes, userName, postMessage };
};

router.get(
  "/board",
  async (req: Request, res: Response, next: NextFunction) => {
    const query = Board.aggregate([
      { $sort: { datetime: -1 } },
      { $limit: 10 },
    ]).exec((err, data) => {
      res.json(data);
    });
  }
);
router.post(
  "/board",
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentUser } = req;
    if (!currentUser) {
      return next(new NotAuthorizedError());
    }
    const postMessage = req.body.postMessage;
    if (!postMessage) return;

    const userId = currentUser.id;
    const userName = currentUser.email;
    const likes = 0;

    const board = Board.build({
      userId,
      likes,
      userName,
      postMessage,
    });
    await board.save();

    res.status(201).send({});
  }
);

router.post(
  "/pou",
  [body("name").optional().isString()],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentUser } = req;
    if (!currentUser) {
      return next(new NotAuthorizedError());
    }
  }
);

export { router as boardRouter };
