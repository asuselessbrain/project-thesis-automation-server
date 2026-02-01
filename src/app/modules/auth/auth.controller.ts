import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/responser";
import { AuthService } from "./auth.service";
import { config } from "../../../config";

const cookieOptions = {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "lax" as const,
    path: "/",
};

const dayToMs = (days: number) => days * 24 * 60 * 60 * 1000;

const login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await AuthService.loginUser({ email, password });
    sendResponse(res, 200, "Login successful", result);
});

const verifyOtp = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const result = await AuthService.verifyOtp(email, otp);
    const { refreshToken, token } = result;

    res.cookie("accessToken", token, {
        ...cookieOptions,
        maxAge: dayToMs(Number(config.jwt.token_expires_in?.split("d")[0])),
    });

    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: dayToMs(Number(config.jwt.refresh_token_expires_in?.split("d")[0])),
    })
    sendResponse(res, 200, "OTP verified successfully", null);
});

const generateNewToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await AuthService.generateNewToken(refreshToken);
    res.cookie("accessToken", result, {
        ...cookieOptions,
        maxAge: dayToMs(Number(config.jwt.token_expires_in?.split("d")[0])),
    });

    sendResponse(res, 200, "New token generated successfully", { data: result });
});

const resendOtp = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await AuthService.resendOtp(email);
    sendResponse(res, 200, "OTP resend Successfully", result)
})

const logout = catchAsync(async (req: Request, res: Response) => {

    const result = await AuthService.logout();

    res.clearCookie("refreshToken", cookieOptions);
    res.clearCookie("accessToken", cookieOptions);

    sendResponse(res, 200, "Logout successful", result);
})

export const AuthController = {
    login,
    verifyOtp,
    generateNewToken,
    resendOtp,
    logout
};