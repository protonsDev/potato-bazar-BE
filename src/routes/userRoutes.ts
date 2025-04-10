import { createValidator } from "express-joi-validation";
import express from "express";
import { userSchema } from "../validation/userValidation";
import { signup, login, getUserProfile, getSellerList } from "../controller/user";
import { authMiddleware } from "../utlis/userAuth";
const router = express.Router();
const validator = createValidator({});

router.post("/signup", validator.body(userSchema), signup);
router.post("/login", login);
router.get("/seller-list", getSellerList);
router.get("/user-profile", authMiddleware,getUserProfile);


export default router;
