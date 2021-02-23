import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import multer from "multer";
import streamifier from 'streamifier';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

export const uploader = multer({});

export const cloudinaryMiddleware = (req, res, next) => {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  async function upload(req) {
    let result = await streamUpload(req);
    return result;
  }

  upload(req)
    .then((data) => {
      //@ts-ignore
      req.file.filename = data.secure_url
      next();
    })
    .catch(next);
}