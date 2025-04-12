import Joi from "joi";


export const negotiationSchema = Joi.object({
  quoteId: Joi.number().integer().required(), 
  proposedCostPerKg: Joi.number().precision(2).positive().optional(), 
  proposedCostForKg: Joi.number().precision(2).positive().optional(), 
  status:Joi.string().required().valid("pending"),
  message: Joi.string().required(),
  proposedBy: Joi.string().required().valid("buyer","supplier")
});


export const negotiationStatusSchema = Joi.object({
  status: Joi.string().valid("accepted", "rejected").required(),
  negotiationId:Joi.number().integer().required(),
  costType: Joi.string().valid('perKg', 'forPrice').required(), 

});
