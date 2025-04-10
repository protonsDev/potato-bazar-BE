import express from "express";
import { createValidator } from "express-joi-validation";
import { authMiddleware } from "../utlis/userAuth";
import { createSubscriberSchema } from "../validation/notificationValidation";
import { createSubscriber } from "../controller/notification";
const router = express.Router();
const validator = createValidator();


router.post(
    "/",
    authMiddleware,
    validator.body(createSubscriberSchema),
    createSubscriber
  );

  
export default router;
