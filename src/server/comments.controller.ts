import "reflect-metadata";

import { Request, Response } from "express";
import { controller, httpGet, httpPost, interfaces, request, requestBody, requestParam, response } from "inversify-express-utils";
import { authenticate } from '../config/utils.common';
import { Comments } from '../data/comment/comment.model';
import { CommentDTO } from "../data/comment/comment.schema";
import { NotFoundError } from '../data/errors';
import { transport } from '../services/messages';
import dotenv from 'dotenv';
// import axios from 'axios';
import { Users } from '../data/user/user.model';

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

      console.log({ user: req.user, owner, origin })
      if (owner._id === req.user.id) {
        return;
      } else {
        const message = `${req.user.name} replied to your comment: "${body.message}"`;

        transport.sendMail({
          from: process.env.MAILTRAP_FROM,
          to: owner.email,
          subject: 'Design Your Model S | Tesla',
          text: message
        });

        // axios.post(process.env.NEXMO_URL, {
        //   from: { "type": "whatsapp", "number": process.env.NEXMO_FROM },
        //   to: { "type": "whatsapp", "number": owner.phone },
        //   message: {
        //     "content": {
        //       "type": "text",
        //       "text": message
        //     }
        //   }
        // }, {
        //   auth: {
        //     username: process.env.NEXMO_KEY,
        //     password: process.env.NEXMO_SECRET
        //   }
        // })
        //   .catch(err => { console.error(err.message); })
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