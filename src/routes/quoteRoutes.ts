import { createValidator } from "express-joi-validation";
import express from "express";
import { authMiddleware } from "../utlis/userAuth";
import { quoteSchema, deliveryScheduleQuoteSchema } from "../validation/quoteValidation";
import { submitQuote , submitDeliveryScheduleQuotes} from "../controller/quote";
const router = express.Router();
const validator = createValidator({});

router.post("/", validator.body(quoteSchema),authMiddleware ,submitQuote);
router.post("/delivery-quotes", validator.body(deliveryScheduleQuoteSchema),authMiddleware ,submitDeliveryScheduleQuotes);


export default router;