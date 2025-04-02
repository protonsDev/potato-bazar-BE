import Joi from "joi";

export const rfqSchema = Joi.object({
  title: Joi.string().min(3).max(255).required().label("Title"),
  quantity: Joi.number().positive().precision(2).required().label("Quantity"),
  unitType: Joi.string()
    .valid("MT", "Quintal", "Kg")
    .required()
    .label("Unit Type"),
  targetPrice: Joi.number().positive().precision(2).allow(null).label("Target Price"),
  potatoVariety: Joi.string().allow(null, "").label("Potato Variety"),
  grade: Joi.string()
    .valid("Premium", "Standard", "Economy")
    .allow(null)
    .label("Grade"),
  size: Joi.string()
    .valid("Small", "Medium", "Large", "Mixed")
    .allow(null)
    .label("Size"),
  packagingType: Joi.string().allow(null, "").label("Packaging Type"),
  quantityPerBag: Joi.number().positive().precision(2).allow(null).label("Quantity Per Bag"),
  paymentTerms: Joi.string()
    .valid("Advance", "COD", "Credit")
    .required()
    .label("Payment Terms"),
  customPaymentTerms: Joi.string().allow(null, "").label("Custom Payment Terms"),
  remarks: Joi.string().allow(null, "").label("Remarks"),
  status: Joi.string()
    .valid("draft", "active", "closed", "awarded")
    .default("draft")
    .label("Status"),
  submissionDeadline: Joi.date().allow(null).label("Submission Deadline"),
  deliverySchedules: Joi.array()
    .items(
      Joi.object({
        deliveryLocation: Joi.string().min(3).required().label("Delivery Location"),
        quantity: Joi.number().positive().required().label("Quantity"),
        deliveryDeadline: Joi.date().required().label("Delivery Deadline"),
      })
    )
    .min(1)
    .required()
    .label("Delivery Schedules"),
  category: Joi.string().allow(null, "").label("Category"),
  isTpod: Joi.boolean().allow(null).label("Is TPOD"),
  isUc: Joi.boolean().allow(null).label("Is UC"),
});


export const rfqSupplierSchema = Joi.object({
  rfqId: Joi.number().integer().positive().required().label("RFQ ID"),
  supplierIds: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required()
    .label("Supplier IDs"),
});
