import "reflect-metadata";

import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import { Request, Response } from "express";
import { controller, httpGet, httpPost, interfaces, request, requestBody, response } from "inversify-express-utils";
import jwt from "jsonwebtoken";
import { ConflictError, ForbiddenError, NotFoundError } from "../data/errors";
import { Users } from "../data/user/user.model";
import { LoginDTO, UserDTO } from '../data/user/user.schema';
import { validate } from "../config/utils.common";
import { isLoginDto, isUserDto } from './utils';

dotenv.config();

@controller("/users")
export class UsersController implements interfaces.Controller {
  @httpGet("/")
  async getUser(@request() req: Request, @response() res: Response) {
    res.status(200).json({ status: "success", data: await Users.find() })
  }

  @httpPost("/", validate(isUserDto))
  async createUser(@request() req: Request, @response() res: Response, @requestBody() body: UserDTO) {
    try {
      await Users.create({
        ...body,
        location: {
          coordinates: body.coordinates
        },
        password_hash: bcrypt.hashSync(body.password, 8)
      });
      res.status(201).json({ status: "success", msg: "user created successfully", data: { ...body } });
    } catch (err) {
      if (err.message.includes("E11000")) {
        throw new ConflictError("Email is already in use");
      }

      throw err;
    }
  }

  @httpPost("/login", validate(isLoginDto))
  async login(@request() req: Request, @response() res: Response, @requestBody() body: LoginDTO) {
    const user = await Users.findOne({ email: body.email }, "+password_hash");
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const passwordIsValid = await bcrypt.compare(body.password, user.password_hash);
    if (!passwordIsValid) {
      throw new ForbiddenError("Incorrect password");
    } else {
      const token = jwt.sign({
        id: user._id,
        email: user.email,
        name: user.name,
        location: user.location
      }, process.env.SECURITY_HASH, {
        expiresIn: process.env.TOKEN_EXPIRY,
      });

      return res
        .status(200)
        .json({
          status: "success",
          data: token
        });
    }
  }
}