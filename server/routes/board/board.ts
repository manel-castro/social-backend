import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { NotAuthorizedError } from "../../common/errors/not-authorized-error";
import { validateRequest } from "../../common/middlewares/validate-request";
import { BoardDoc } from "../../models/board";

const express = require("express");

const router = express.Router();

export const defaultResponse = ({ board }: { board: BoardDoc }) => {
  const { userId } = board;

  return { userId };
};

router.get(
  "/board",
  async (req: Request, res: Response, next: NextFunction) => {}
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
