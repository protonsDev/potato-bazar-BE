import Joi from "joi";

export const userSchema = Joi.object({
  email: Joi.string().email().required().label("Email"),
  passwordHash: Joi.string().min(8).required().label("Password Hash"),
  name: Joi.string().min(3).max(50).required().label("Name"),
  phone: Joi.string()
    .required()
    .label("Phone"),
  role: Joi.string().valid("buyer", "seller").required().label("Role"),
  companyName: Joi.string().allow(null, "").label("Company Name"),
  address: Joi.string().allow(null, "").label("Address"),
  gstin: Joi.string().optional(),
  isVerified: Joi.boolean().default(false).label("Is Verified"),
  isActive: Joi.boolean().default(true).label("Is Active"),
  alternatePhone: Joi.string()
    .optional()
    .label("alternatePhone"),
});
