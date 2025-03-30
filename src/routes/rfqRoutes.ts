import { createValidator } from "express-joi-validation";
import express from "express";
import { rfqSchema } from "../validation/rfqValidation";
import { createRFQ } from "../controller/rfq";
import { authMiddleware } from "../utlis/userAuth";
const router = express.Router();
const validator = createValidator({});

router.post("/", validator.body(rfqSchema),authMiddleware ,createRFQ);

export default router;