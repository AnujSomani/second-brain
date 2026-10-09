const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};
export const config = {
  databaseUrl: getEnv("DATABASE_URL"),
  jwtSecret: getEnv("USER_JWT_SECRET"),
  port: process.env["PORT"] ?? "3000",
  resendApiKey: getEnv("RESEND_API_KEY"),
  frontendUrl: process.env["FRONTEND_URL"] ?? null,
  geminiApiKey: getEnv("GEMINI_API_KEY"),
  googleClientId: getEnv("OAUTH_CLIENT_ID"),
  googleClientSecret: getEnv("OAUTH_CLIENT_SECRET"),
  googleRedirectUri: getEnv("GOOGLE_REDIRECT_URI"),
};