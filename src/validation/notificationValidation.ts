import Joi from "joi";

export const createSubscriberSchema = Joi.object({
  userId: Joi.number().required(),
  deviceToken: Joi.string().required(),
  externalUserId: Joi.string().required(),
});
