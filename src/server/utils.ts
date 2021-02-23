import joi from "joi";

export const isLoginDto = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

export const isUserDto = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  phone: joi.string().required(),
  coordinates: joi.array().items(joi.number()).required().length(2),
});
