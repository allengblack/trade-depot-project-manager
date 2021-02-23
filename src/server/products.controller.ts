import "reflect-metadata";

import { controller, httpGet, httpPost, interfaces, request, requestBody, response } from "inversify-express-utils";
import { Request, Response } from "express";
import { uploader } from '../services/uploads';
import { Products } from '../data/product/product.model';
import { authenticate } from '../config/utils.common';
import { ProductDTO } from '../data/product/product.schema';
import { db } from '../services/firestore';

@controller("/products")
export class ProductsController implements interfaces.Controller {
  @httpPost("/", authenticate, uploader)
  async createProduct(@request() req: Request, @response() res: Response, @requestBody() body: ProductDTO) {
    const product = await Products.create({
      name: body.name,
      image: req.file.filename,
      location: {
        coordinates: JSON.parse(body.coordinates)
      },
      user: req.user.id
    });

    const ref = db.collection("products").doc(product._id);
    ref.set({
      name: product.name,
      location: JSON.stringify(product.location),
      user: product.user
    })
      .catch(err => {
        console.error("Error syncing to Firestore: " + err)
      });
    res.json({ status: "success", data: product });
  }

  @httpGet("/", authenticate)
  async getProducts(@request() req: Request, @response() res: Response) {
    const products = await Products.find({
      location: {
        $geoIntersects: {
          $geometry: req.user.location
        }
      }
    });

    res.json({ status: "success", data: products })
  }
}