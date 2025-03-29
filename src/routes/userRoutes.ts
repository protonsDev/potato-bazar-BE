import { createValidator } from "express-joi-validation";
import express from "express";
import { userSchema } from "../validation/userValidation";
import { signup, login, getUserProfile } from "../controller/user";
const router = express.Router();
const validator = createValidator({});

router.post("/signup", validator.body(userSchema), signup);
router.post("/login", login);

export default router;
