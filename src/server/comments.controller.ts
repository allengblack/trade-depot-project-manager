import "reflect-metadata";

import { Request, Response } from "express";
import { controller, httpGet, httpPost, interfaces, request, requestBody, requestParam, response } from "inversify-express-utils";
import { authenticate } from '../config/utils.common';
import { Comments } from '../data/comment/comment.model';
import { CommentDTO } from "../data/comment/comment.schema";
import { NotFoundError } from '../data/errors';

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

    res.status(201).json({
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