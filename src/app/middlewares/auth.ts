import { NextFunction, Request, Response } from "express";
import { jwtVerifier } from "../../shared/jwtGenerator";
import { config } from "../../config";
import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { JwtPayload, Secret } from "jsonwebtoken";
import AppError from "../errors/appErrors";

const auth = (...roles: string[]) => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;

        if (!token) {
            throw new AppError(401, "invalid signature");
        }

        const bearerToken = token.split(" ")[1]

        let decoded

        try {
            decoded = jwtVerifier({ token: bearerToken as string, secretKey: config.jwt.token_secret as Secret }) as JwtPayload;
        }
        catch (err: any) {
            if (err.name === "TokenExpiredError") {
                throw new AppError(401, "Access token expired");
            }

            if (err.name === "JsonWebTokenError") {
                throw new AppError(401, "Invalid token");
            }

            throw new AppError(401, "Unauthorized");
        }

        const user = await prisma.user.findUnique({
            where: {
                email: decoded.email,
                userStatus: UserStatus.ACTIVE
            }
        })

        if (!user) {
            throw new AppError(404, "User not found");
        }


        if (roles.length && !roles.includes(user.role)) {
            throw new AppError(403, "You are not authorized to access this route");
        }

        req.user = decoded as JwtPayload

        next()
    }
}

export default auth;