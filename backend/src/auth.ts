import { Router } from "express";
import type { Request, Response } from "express";
import { signupSchema, signinSchema, verifyEmailSchema, resendOtpSchema, updatePasswordSchema, forgotPasswordSchema, resetPasswordSchema } from "./validation.js";
import { prisma } from "./prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "./config.js";
import { generateOtp, generateOtpExpiry } from "./otp.js";
import { sendOtpEmail } from "./sendEmail.js";
import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import { middleware } from "./middlewares/user.js";
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please slow down" },
});
const signinLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => {
    const ip = req.ip ?? "unknown";
    return req.body?.email ?? ipKeyGenerator(ip);
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many signin attempts for this account, try again later" },
});
const authrouter = Router();
authrouter.post("/api/v1/signup", authLimiter, async (req: Request, res: Response) => {
  const parsedData = signupSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(411).json({ message: "Invalid Input" });
  }
  const { username, email, password } = parsedData.data;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpiresAt = generateOtpExpiry();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        otp: hashedOtp,
        otpExpiresAt,
      },
    });
    await sendOtpEmail(email, otp);
    return res.status(201).json({
      message: "Signup successful. Check your email for the OTP.",
      userId: user.id,
      email: email
    });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
authrouter.post("/api/v1/signin", signinLimiter, async (req: Request, res: Response) => {
  const parsedData = signinSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(411).json({ message: "Invalid Input" });
  }
  const { email, password } = parsedData.data;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Can't find email" });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email first" });
    }
    if (!user.password) {
      return res.status(401).json({ message: "use google sign-in for this account" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { userId: user.id },
      config.jwtSecret,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "Signed in successfully",
      username: user.username,
    });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
authrouter.post("/api/v1/logout", middleware, (_req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logged out successfully" });
});
authrouter.post("/api/v1/verify-email", authLimiter, async (req: Request, res: Response) => {
  const parsedData = verifyEmailSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(411).json({ message: "Invalid Input" });
  }
  const { email, otp } = parsedData.data;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid request" });
    }
    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({ message: "No OTP found. Please request a new one." });
    }
    if (new Date() > user.otpExpiresAt) {
      return res.status(400).json({ message: "OTP has expired" });
    }
    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    await prisma.user.update({
      where: { email },
      data: { isVerified: true, otp: null, otpExpiresAt: null },
    });
    const token = jwt.sign(
      { userId: user.id },
      config.jwtSecret,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
authrouter.post("/api/v1/resend-otp", authLimiter, async (req: Request, res: Response) => {
  const parsedData = resendOtpSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(411).json({ message: "Invalid Input" });
  }
  const { email } = parsedData.data;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }
    const otp = generateOtp();
    const otpExpiresAt = generateOtpExpiry();
    const hashedOtp = await bcrypt.hash(otp, 10);
    await prisma.user.update({
      where: { email },
      data: { otp: hashedOtp, otpExpiresAt },
    });
    await sendOtpEmail(email, otp);
    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
authrouter.patch("/api/v1/update-password", middleware, async (req: Request, res: Response) => {
  const parsedData = updatePasswordSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(411).json({ message: "Invalid Input" });
  }
  const { currentPassword, newPassword } = parsedData.data;
  const userId = req.userId!;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.password) {
      return res.status(400).json({ message: "No password set for this account" });
    }
    const storedPassword = user.password;
    const passwordMatch = await bcrypt.compare(currentPassword, storedPassword);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const isSamePassword = await bcrypt.compare(newPassword, storedPassword);
    if (isSamePassword) {
      return res.status(400).json({ message: "New password can't be the same as current" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
authrouter.post("/api/v1/forgot-password", authLimiter, async (req: Request, res: Response) => {
  const parsedData = forgotPasswordSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(411).json({ message: "Invalid Input" });
  }
  const { email } = parsedData.data;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(200).json({ message: "If an email exists, an OTP has been sent" })
    }
    const otp = generateOtp();
    const otpExpiresAt = generateOtpExpiry();
    const hashedOtp = await bcrypt.hash(otp, 10);
    await prisma.user.update({
      where: { email },
      data: { otp: hashedOtp, otpExpiresAt },
    });
    await sendOtpEmail(email, otp);
    return res.status(200).json({ message: "If this email exists, an OTP has been sent" });
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
authrouter.post("/api/v1/reset-password", authLimiter, async (req: Request, res: Response) => {
  const parsedData = resetPasswordSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(411).json({ message: "Invalid Input" });
  }
  const { email, otp, newPassword } = parsedData.data;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.otp || !user.otpExpiresAt) {
      return res.status(400).json({ message: "Invalid request" });
    }
    if (new Date() > user.otpExpiresAt) {
      return res.status(400).json({ message: "OTP has expired" });
    }
    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (user.password) {
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({ message: "New password can't be the same as current" });
      }
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpiresAt: null,
      },
    });
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
export default authrouter;