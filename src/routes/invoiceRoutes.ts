import express from "express";
import { createValidator } from "express-joi-validation";
import {
  createInvoice,
  getInvoiceById,
  listInvoices,
  updateInvoicePayment,
  getInvoiceByUserId
} from "../controller/invoice";
import { createInvoiceSchema,invoicePaymentSchema } from "../validation/invoiceValidation";
import { authMiddleware } from "../utlis/userAuth";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  
  validator.body(createInvoiceSchema),
  createInvoice
);
router.get("/user-invoice", authMiddleware, getInvoiceByUserId);
router.get("/", authMiddleware, listInvoices);
router.get("/:id", getInvoiceById);
router.patch(
  "/update-payment",
  authMiddleware,
  validator.body(invoicePaymentSchema),
  updateInvoicePayment
);


export default router;
