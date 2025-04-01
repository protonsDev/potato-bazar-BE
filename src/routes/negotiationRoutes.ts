import express from "express";
import {
  submitNegotiation,
  fetchNegotiationsByQuote,
  modifyNegotiationStatus,
  fetchPendingNegotiations
} from "../controller/negotiation";
import { authMiddleware } from "../utlis/userAuth";
import { createValidator } from "express-joi-validation";
import { negotiationSchema, negotiationStatusSchema } from "../validation/negotiationValidation";
const validator = createValidator({});

const router = express.Router();

router.post("/", authMiddleware,validator.body(negotiationSchema), submitNegotiation);
router.get("/quote/:quoteId", fetchNegotiationsByQuote);
router.patch("/status",  authMiddleware,validator.body(negotiationStatusSchema), modifyNegotiationStatus);
router.get("/pending/:proposerId", fetchPendingNegotiations);


export default router;