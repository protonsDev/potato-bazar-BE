import { createValidator } from "express-joi-validation";
import express from "express";
import { rfqSchema, rfqSupplierSchema } from "../validation/rfqValidation";
import { addSuppliers, createRFQ, getSupplierRFQsController, getSupplierRFQsDetails, getMyRFQsController } from "../controller/rfq";
import { authMiddleware } from "../utlis/userAuth";
const router = express.Router();
const validator = createValidator({});

router.post("/", validator.body(rfqSchema),authMiddleware ,createRFQ);
router.post("/invite-suppliers", validator.body(rfqSupplierSchema),authMiddleware ,addSuppliers);
router.get("/supplier-rfqs",authMiddleware ,getSupplierRFQsController);
router.get("/rfqs-details",authMiddleware ,getSupplierRFQsDetails);
router.get("/my-details",authMiddleware ,getMyRFQsController);


export default router;