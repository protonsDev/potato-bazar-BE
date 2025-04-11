import express from "express";
import { createValidator } from "express-joi-validation";
import {
  createDispatch,
  getDispatchById,
  getAllDispatches,
  updateDispatch,
  deleteDispatch,
  createStatusLog,
  getLogsByDispatchId,
  deleteStatusLog,
  getQuoteAggregateDetails,
  getDeliveryScheduleQuoteforRfq,
  supplierDeliveryList,
  getDispatchesForBuyer
} from "../controller/delivery";

import {
  dispatchSchema,
  dispatchStatusLogSchema,
} from "../validation/deliveryValidation";
import { authMiddleware } from "../utlis/userAuth";

const router = express.Router();
const validator = createValidator({});

// 🔹 Dispatch Routes
router.post("/",authMiddleware, validator.body(dispatchSchema), createDispatch);
// router.get("/",authMiddleware, getAllDispatches);
// router.get("/getDispatchById/:id", authMiddleware,getDispatchById);
router.put("/:id", updateDispatch);
router.delete("/:id", authMiddleware,deleteDispatch);
router.get("/delivery-details", authMiddleware,getQuoteAggregateDetails);
router.get("/delivery-quote-schedule", authMiddleware,getDeliveryScheduleQuoteforRfq);
router.get("/dispatch-list", authMiddleware,supplierDeliveryList);
router.get("/buyer-dispatch-list", authMiddleware,getDispatchesForBuyer);


// 🔹 Dispatch Status Log Routes
router.post("/status-log", authMiddleware,validator.body(dispatchStatusLogSchema), createStatusLog);
router.get("/:dispatchId/status-log", authMiddleware,getLogsByDispatchId);
router.delete("/status-log/:id",authMiddleware, deleteStatusLog);

export default router;
