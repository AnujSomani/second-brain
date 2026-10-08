import crypto from "node:crypto";

export const generateOtp = (): string => {
  return crypto.randomInt(100000, 1000000).toString();
};

export const generateOtpExpiry = (): Date => {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};
