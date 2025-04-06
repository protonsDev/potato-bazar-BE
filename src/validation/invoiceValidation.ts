import Joi from "joi";

export const createInvoiceSchema = Joi.object({
  quoteId: Joi.number().required(),
  dispatchId: Joi.number().required(),
  sellerId: Joi.number().required(),
  buyerId: Joi.number().required(),
  invoiceDate: Joi.date().required(),
  dueDate: Joi.date().optional(),
  quantity: Joi.number().required(),
  pricePerUnit: Joi.number().required(),
  tax: Joi.number().optional().default(0),
  paymentMode: Joi.string().optional(),
  paymentReference: Joi.string().optional(),
  notes: Joi.string().allow("").optional(),
});

export const invoicePaymentSchema = Joi.object({
  paymentMode: Joi.string().required(),
  paymentDate: Joi.date().required(),
  paymentReference: Joi.string().required(),
  notes: Joi.string().allow(""),
});

