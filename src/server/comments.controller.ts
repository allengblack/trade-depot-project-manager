import "reflect-metadata";

import { Request, Response } from "express";
import { controller, httpGet, httpPost, interfaces, request, requestBody, requestParam, response } from "inversify-express-utils";
import { authenticate } from '../config/utils.common';
import { Comments } from '../data/comment/comment.model';
import { CommentDTO } from "../data/comment/comment.schema";
import { NotFoundError } from '../data/errors';
import dotenv from 'dotenv';
import { Users } from '../data/user/user.model';
import { gunner } from "../services/messages";

dotenv.config();

@controller("/comments")
export class CommentsController implements interfaces.Controller {
  @httpPost("/", authenticate)
  async createComment(@request() req: Request, @response() res: Response, @requestBody() body: CommentDTO) {
    await Comments.create({
      message: body.message,
      user: req.user.id,
      product: body.product,
      reply_to: body.reply_to
    });

    if (body.reply_to) {
      const origin = await Comments.findById(body.reply_to);
      const owner = await Users.findOne({ _id: origin.user });

      if (owner._id === req.user.id) {
        return;
      } else {
        const message = `${req.user.name} replied to your comment: "${body.message}"`;

        const data = {
          from: 'Admin <tradedepottest@sandbox72fb9a060c11490c950d2c0f6aec76ac.mailgun.org>',
          to: 'allengblack@gmail.com,	tradedepotinterview@mailinator.com',
          subject: 'A Reply To Your Comment',
          text: message
        };

        gunner.messages().send(data, (error, body) => { });
      }
    }

    res.status(201)
      .json({
        status: "success",
        data: body
      })
  }

  @httpGet("/")
  async getComments(@request() req: Request, @response() res: Response) {
    const comments = await Comments.find({});
    res.json({ status: "success", data: comments });
  }

  @httpGet("/:id")
  async getComment(@request() req: Request, @response() res: Response, @requestParam("id") id: string) {
    const comment = await Comments.findOne({ _id: id });
    if (!comment) {
      throw new NotFoundError("Comment not found.");
    }
    res.json({ status: "success", data: comment });
  }
}