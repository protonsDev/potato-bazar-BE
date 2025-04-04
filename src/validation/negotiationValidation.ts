import Joi from "joi";


export const negotiationSchema = Joi.object({
  quoteId: Joi.number().integer().required(), 
  proposedCost: Joi.number().precision(2).positive().required(), 
  proposedBy: Joi.string().required().valid('buyer','supplier'),
  status:Joi.string().required().valid("pending"),
  message: Joi.string().required(),

});


export const negotiationStatusSchema = Joi.object({
  status: Joi.string().valid("accepted", "rejected").required(),
  negotiationId:Joi.number().integer().required()
});
