import "reflect-metadata";

import * as bodyParser from 'body-parser';
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import mongoose from "mongoose";
import morgan from 'morgan';
import { ControllerError, ConstraintValidationError } from './data/errors';
import "./server";

dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

const container = new Container();
const server = new InversifyExpressServer(container);

server
  .setConfig((app) => {
    // add body parser
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.use(bodyParser.json());
    app.use(morgan('tiny'));
  })
  .setErrorConfig((app) => {
    app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
      if (res.headersSent) return next(err);

      if (err instanceof ControllerError) {
        const statusCode = err.statusCode;
        res
          .status(statusCode)
          .json({
            status: "error",
            message: err.message,
            ...(err instanceof ConstraintValidationError ? { data: err.data } : {})
          });
      } else {
        next(err);
      }
    });
  });

const app = server.build();
app.listen(PORT);