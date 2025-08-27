import { Router } from "express";
import {
  getUserProfile,
  loginUser,
  registerUser,
} from "../controller/controller.js";
import { isAuth } from "../middleware/validateAuth.js";

const router = Router();

router
  .post("/user/register", registerUser)
  .post("/user/login", loginUser)
  .get("/user/me", isAuth, getUserProfile);

export default router;
