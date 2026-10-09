import { apiRequest } from "./api";

export type SignupResponse = {
  message: string;
  userId: string;
  email: string;
};

export type MessageResponse = {
  message: string;
  username?: string;
};

export function signup(input: { username: string; email: string; password: string }) {
  return apiRequest<SignupResponse>("/api/v1/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function signin(input: { email: string; password: string }) {
  return apiRequest<MessageResponse>("/api/v1/signin", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function verifyEmail(input: { email: string; otp: string }) {
  return apiRequest<MessageResponse>("/api/v1/verify-email", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function resendOtp(input: { email: string }) {
  return apiRequest<MessageResponse>("/api/v1/resend-otp", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function forgotPassword(input: { email: string }) {
  return apiRequest<MessageResponse>("/api/v1/forgot-password", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function resetPassword(input: { email: string; otp: string; newPassword: string }) {
  return apiRequest<MessageResponse>("/api/v1/reset-password", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updatePassword(input: { currentPassword: string; newPassword: string }) {
  return apiRequest<MessageResponse>("/api/v1/update-password", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function logout() {
  return apiRequest<MessageResponse>("/api/v1/logout", {
    method: "POST",
  });
}