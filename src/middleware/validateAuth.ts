import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser, User } from "../model/model.js";
import asyncHandler from "../utils/asyncHandler.js";

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = req.headers.token as string;

    if (!token) {
      res.status(401).json({
        message: "No token provided, authorization denied",
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!decoded || !decoded._id) {
      res.status(401).json({
        message: "Invalid token, authorization denied",
      });
      return;
    }

    const userId = decoded._id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }
    req.user = user;
    next();
  }
);
