import Joi from "joi";

// Dispatch Validation
export const dispatchSchema = Joi.object({
  deliveryScheduleQuoteId: Joi.number().required(),
  transporter: Joi.string().required(),
  vehicleNumber: Joi.string().required(),
  driverName: Joi.string().required(),
  driverContact: Joi.string().pattern(/^[0-9]{10}$/).required(),
  notes: Joi.string().allow(""),
  quoteId: Joi.number().required(),

});

// Status Log Validation
export const dispatchStatusLogSchema = Joi.object({
  dispatchId: Joi.number().required(),
  status: Joi.string().required(),
  description: Joi.string().allow(""),
  timestamp: Joi.date().required(),
});
