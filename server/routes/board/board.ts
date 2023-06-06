import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { NotAuthorizedError } from "../../common/errors/not-authorized-error";
import { validateRequest } from "../../common/middlewares/validate-request";
import { Board, BoardAttrs, BoardDoc } from "../../models/board";
import { User } from "../../models/user";
import { RequestValidationError } from "../../common/errors/request-validation-error";
import { BadRequestError } from "../../common/errors/bad-request-error";

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
  [
    body("postMessage")
      .isString()
      .isLength({ min: 2, max: 200 })
      .withMessage("Invalid Message"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentUser } = req;
    if (!currentUser) {
      return next(new NotAuthorizedError());
    }
    const user = await User.findById(currentUser.id);
    const userId = currentUser.id;
    if (!user) {
      return next(new NotAuthorizedError());
    }

    if (!req.body.postMessage) {
      return next(new BadRequestError("Invalid postMessage"));
    }

    const userName = user.name;
    const publicId = user.publicId;
    const likes = 0;

    const board = Board.build({
      userId,
      likes,
      userName,
      postMessage: req.body.postMessage,
      userPublicId: publicId,
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
