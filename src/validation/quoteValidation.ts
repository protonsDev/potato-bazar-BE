import Joi from "joi";

export const quoteSchema = Joi.object({
    rfqId: Joi.number().required(),
    productionCapacity: Joi.number().required(),
    certifications: Joi.array().items(Joi.string()),
    sampleAvailable: Joi.boolean(),
    packagingType: Joi.string().required(),
    quantityPerPack: Joi.number().required(),
    paymentTerms: Joi.string().required(),
    additionalRemarks: Joi.string().allow(""),
    termsAndConditions: Joi.string().allow(""),
    totalCost: Joi.number().precision(2).min(0).required(),
    status: Joi.string().valid('draft','submitted').optional(),
  });

export const deliveryScheduleQuoteSchema = Joi.object({
    quoteId: Joi.number().integer().required(),
  
    deliveryQuotes: Joi.array()
      .items(
        Joi.object({
          deliveryScheduleId: Joi.number().integer().required(),
          pricePerKg: Joi.number().precision(2).positive().required(), 
          forPricePerKg: Joi.number().precision(2).positive().allow(null),
          remark: Joi.string().allow(null, "").label("Remarks"),
        })
      )
      .min(1)
      .required(),
      totalValue: Joi.number().precision(2).min(0).optional(),
      targetValueForKg: Joi.number().precision(2).min(0).optional(),

      

  });
