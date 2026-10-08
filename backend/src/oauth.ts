import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import { config } from "./config.js";
import type { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma.js";

const oauthRouter = Router();

const client = new OAuth2Client({
  clientId: config.googleClientId,
  clientSecret: config.googleClientSecret,
  redirectUri: config.googleRedirectUri,
});

oauthRouter.get("/api/v1/auth/google", (req: Request, res: Response) => {

  const state = crypto.randomBytes(16).toString("hex");

  res.cookie("oauth_state", state, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    maxAge: 5 * 60 * 1000,
  });

  const authUrl = client.generateAuthUrl({
    scope: ["openid", "email", "profile"],
    state,
  });

  return res.redirect(authUrl);
})

oauthRouter.get("/api/v1/auth/google/callback", async (req: Request, res: Response) => {
  const { code, state } = req.query;
  const savedState = req.cookies["oauth_state"];

  res.clearCookie("oauth_state");

  if (!code || !state || state !== savedState) {
    return res.status(403).json({ message: "Invalid or expired OAuth state" });
  }

  try {
    const { tokens } = await client.getToken(code as string);
    if (!tokens.id_token) {
      return res.status(400).json({ message: "Could not verify Google account" });
    }

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: config.googleClientId,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub || payload.email_verified !== true) {
      return res.status(400).json({ message: "Could not verify Google account" });
    }

    const { email, sub: googleId, name } = payload;
    const username = (name ?? email.split("@")[0] ?? email).slice(0, 30);

    let user = await prisma.user.findUnique({ where: { googleId } });

    if (!user) {
      const existing = await prisma.user.findUnique({ where: { email } });

      if (existing?.isVerified) {
        user = await prisma.user.update({
          where: { email },
          data: { googleId },
        });
      } else if (existing && !existing.isVerified) {
        user = await prisma.$transaction(async (tx) => {
          await tx.user.delete({ where: { id: existing.id } });
          return tx.user.create({
            data: { email, username, googleId, isVerified: true },
          });
        });
      } else {
        user = await prisma.user.create({
          data: { email, username, googleId, isVerified: true },
        });
      }
    }

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(config.frontendUrl ?? "/");
  } catch (e) {
    console.error("Google OAuth error:", e);
    return res.status(500).json({ message: "OAuth sign-in failed" });
  }
});

export default oauthRouter;