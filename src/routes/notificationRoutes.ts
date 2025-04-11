import express from "express";
import { createValidator } from "express-joi-validation";
import { authMiddleware } from "../utlis/userAuth";
import { createSubscriberSchema } from "../validation/notificationValidation";
import { createSubscriber, getMyNotifications } from "../controller/notification";
const router = express.Router();
const validator = createValidator();


router.post(
    "/",
    authMiddleware,
    validator.body(createSubscriberSchema),
    createSubscriber
  );
  router.get(
    "/user-notifications",
    authMiddleware,
    getMyNotifications
  );

  
export default router;
