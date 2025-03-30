import { createValidator } from "express-joi-validation";
import express from "express";
import { rfqSchema, rfqSupplierSchema } from "../validation/rfqValidation";
import { addSuppliers, createRFQ } from "../controller/rfq";
import { authMiddleware } from "../utlis/userAuth";
const router = express.Router();
const validator = createValidator({});

router.post("/", validator.body(rfqSchema),authMiddleware ,createRFQ);
router.post("/invite-suppliers", validator.body(rfqSupplierSchema),authMiddleware ,addSuppliers);

export default router;