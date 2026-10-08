import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { PasswordInput } from "../components/ui/password-input";
import { PasswordRules } from "../components/ui/password-rules";
import { ThemeToggle } from "../components/ui/theme-toggle";
import { clearUserSession, getUserEmail, PASSWORD_RULES } from "../lib/auth";
import { updatePassword, logout } from "../lib/auth-api";
import { cn } from "../lib/cn";
import { ui } from "../lib/ui";
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  CheckIcon,
  LogoutIcon,
} from "../icons";

export function ProfilePage() {
  const navigate = useNavigate();
  const userEmail = getUserEmail();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError("Please enter your current password");
      return;
    }

    if (PASSWORD_RULES.some((rule) => !rule.test(newPassword))) {
      setPasswordError("New password does not meet the required rules");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match");
      return;
    }

    setIsUpdating(true);
    try {
      await updatePassword({ currentPassword, newPassword });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const axiosErr = err as { message?: string };
      setPasswordError(axiosErr?.message || "Failed to update password");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      /* continue clearing session even if logout API fails */
    } finally {
      clearUserSession();
      navigate("/signin");
    }
  };

  return (
    <div className={cn(ui.page, "py-10 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden")}>
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-300/35 dark:bg-purple-900/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-200/40 dark:bg-purple-900/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Bar Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/brain"
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 transition-colors"
          >
            <ArrowLeftIcon className="size-4" />
            Back to Brain
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>

        {/* Profile Card Container */}
        <div className={cn(ui.panel, "p-8 sm:p-12 shadow-2xl shadow-purple-900/5 dark:shadow-purple-950/20 space-y-8")}>
          {/* Header Profile Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-line">
            <div className="relative">
              <div className="size-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/25 ring-4 ring-purple-100 dark:ring-purple-900/40">
                <UserIcon className="size-11 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 size-5 bg-emerald-500 rounded-full border-2 border-surface" />
            </div>

            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold text-ink">
                My Profile
              </h1>
              <p className="mt-1 text-sm text-muted">
                Manage your account credentials and password settings
              </p>
            </div>
          </div>

          {/* Account Details: Registered Email */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
              Account Credentials
            </h2>

            <div className="p-4 rounded-2xl bg-inset border border-line flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="size-11 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                  <EnvelopeIcon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted font-medium">Registered Email ID</p>
                  <p className="text-sm font-bold text-ink truncate">
                    {userEmail}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
                <CheckIcon className="size-3.5" />
                Verified
              </span>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                Change Password
              </h2>
              <Link
                to="/change-password"
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 hover:underline"
              >
                Forgot current password?
              </Link>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <PasswordInput
                label="Current Password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={setCurrentPassword}
              />

              <PasswordInput
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={setNewPassword}
              />

              {/* Password rules checklist reused across the app */}
              <PasswordRules password={newPassword} />

              <PasswordInput
                label="Confirm New Password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />

              {passwordError && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-medium">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ Your password has been successfully updated!
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                title="Update Password"
                loading={isUpdating}
                className="w-full sm:w-auto font-semibold px-6 py-2.5"
              />
            </form>
          </div>

          {/* Centered Logout Button reusing Button danger variant */}
          <div className="pt-8 border-t border-line flex justify-center">
            <Button
              variant="danger"
              title="Log Out"
              startIcon={<LogoutIcon className="size-4" />}
              onClick={handleLogout}
              className="px-8 py-3 rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
