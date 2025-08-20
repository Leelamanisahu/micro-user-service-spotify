import { Router } from "express";
import { loginUser, registerUser } from "../controller/controller.js";

const router = Router();

router.post("/user/register", registerUser).post("/user/login", loginUser);

export default router;
