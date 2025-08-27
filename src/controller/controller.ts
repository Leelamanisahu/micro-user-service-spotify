import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../model/model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../middleware/validateAuth.js";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      res.status(400).json({
        message: "User already exists",
      });
      return;
    }
    const hasPassword = bcrypt.hashSync(password, 10);
    user = await User.create({
      name,
      email,
      password: hasPassword,
    });

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "User registered successfully",
      user,
      token,
    });
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });

  if (!user) {
    res.status(400).json({
      message: "User not found",
    });
    return;
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    res.status(401).json({
      message: "Invalid password",
    });
    return;
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  res.status(200).json({
    message: "User logged in successfully",
    user,
    token,
  });
});

export const getUserProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      message: "User profile retrieved successfully",
      user,
    });
  }
);
