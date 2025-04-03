import { createValidator } from "express-joi-validation";
import express from "express";
import { authMiddleware } from "../utlis/userAuth";
import { quoteSchema, deliveryScheduleQuoteSchema } from "../validation/quoteValidation";
import { submitQuote , submitDeliveryScheduleQuotes, modifyQuoteStatus, getMyQoutes, getQoutesDetails, getQuoteListByRfq} from "../controller/quote";
const router = express.Router();
const validator = createValidator({});

router.post("/", validator.body(quoteSchema),authMiddleware ,submitQuote);
router.post("/delivery-quotes", validator.body(deliveryScheduleQuoteSchema),authMiddleware ,submitDeliveryScheduleQuotes);
router.patch("/update-status",authMiddleware ,modifyQuoteStatus);
router.get("/my-quotes",authMiddleware ,getMyQoutes);
router.get("/quotes-details",authMiddleware ,getQoutesDetails);
router.get("/get-rfq-quotes",authMiddleware ,getQuoteListByRfq);


export default router;