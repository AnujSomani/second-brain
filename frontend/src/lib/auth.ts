export const PENDING_EMAIL_KEY = "brainly:pending-email";

export const PASSWORD_RULES = [
  { id: "length", label: "At least 8 characters", test: (value: string) => value.length >= 8 && value.length <= 50 },
  { id: "lower", label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { id: "upper", label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { id: "digit", label: "One number", test: (value: string) => /[0-9]/.test(value) },
  { id: "special", label: "One special character", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
] as const;

export function passwordIssues(password: string): string[] {
  return PASSWORD_RULES.filter((rule) => !rule.test(password)).map((rule) => rule.label);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const USER_EMAIL_KEY = "brainly:user-email";

export function rememberPendingEmail(email: string) {
  sessionStorage.setItem(PENDING_EMAIL_KEY, email);
}

export function readPendingEmail(): string {
  return sessionStorage.getItem(PENDING_EMAIL_KEY) ?? "";
}

export function saveUserEmail(email: string) {
  localStorage.setItem(USER_EMAIL_KEY, email);
}

export function getUserEmail(): string {
  return localStorage.getItem(USER_EMAIL_KEY) || sessionStorage.getItem(PENDING_EMAIL_KEY) || "user@brainly.app";
}

export function clearUserSession() {
  localStorage.removeItem(USER_EMAIL_KEY);
  sessionStorage.removeItem(PENDING_EMAIL_KEY);
}

export function startGoogleAuth() {
  window.location.assign("/api/v1/auth/google");
}
