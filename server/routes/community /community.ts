import { NextFunction, Request, Response } from "express";
import { BoardAttrs } from "../../models/board";
import { User } from "../../models/user";

const express = require("express");

const router = express.Router();

router.get(
  "/community",
  async (req: Request, res: Response, next: NextFunction) => {
    const query = User.aggregate([
      { $sort: { datetime: -1 } },
      { $limit: 10 },
      { $unset: ["_id", "__v", "password", "email"] },
    ]).exec((err, data) => {
      res.json(data);
    });
  }
);

export { router as communityRouter };
