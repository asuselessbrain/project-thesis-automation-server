import express from "express";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/verify-otp", AuthController.verifyOtp);
router.post("/generate-new-token", AuthController.generateNewToken)
router.post("/resend-otp", AuthController.resendOtp);
router.get('/logout', AuthController.logout)

export const AuthRoutes = router;