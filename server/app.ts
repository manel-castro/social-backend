import cookieSession from "cookie-session";
import cors from "cors";
import { currentUser } from "./common/middlewares/current-user";
import { errorHandler } from "./common/middlewares/error-handler";

import { userRouter } from "./routes/user";
import { boardRouter } from "./routes/board/board";
import { communityRouter } from "./routes/community /community";

const express = require("express");

const app = express();

/**
 * CORS Whitelist for requests
 */
const whitelist = ["http://localhost:3001", "http://localhost:8080"];
app.use(cors({ origin: whitelist }));

/**
 * Other middlewares
 */
app.use(express.json());
app.set("trust proxy", true);
app.use(
  cookieSession({
    signed: false,
    secure: false && process.env.NODE_ENV !== "test", // test run in plain HTTP, not HTTPS // TODO: enable this
  })
);

/**
 * Custom middlewares
 */
app.use(currentUser);

/**
 * Social Routers
 */
app.use(boardRouter);
app.use(communityRouter);

/**
 * User Routers
 */
app.use(userRouter);

/**
 * Errors midleware
 */
app.use(errorHandler);

export { app };
