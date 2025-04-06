import express from "express";
import { createValidator } from "express-joi-validation";
import {
  createInvoice,
  getInvoiceById,
  listInvoices,
  updateInvoicePayment
} from "../controller/invoice";
import { createInvoiceSchema,invoicePaymentSchema } from "../validation/invoiceValidation";
import { authMiddleware } from "../utlis/userAuth";

const router = express.Router();
const validator = createValidator({});

// 🔹 Invoice Routes
router.post(
  "/",
  authMiddleware,
  validator.body(createInvoiceSchema),
  createInvoice
);
router.get("/", authMiddleware, listInvoices);
router.get("/:id", authMiddleware, getInvoiceById);
router.patch(
  "/:id/payment",
  authMiddleware,
  validator.body(invoicePaymentSchema),
  updateInvoicePayment
);

export default router;
