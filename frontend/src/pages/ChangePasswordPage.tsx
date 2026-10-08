import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AuthCard } from "../components/auth/AuthCard";
import { FormMessage } from "../components/auth/FormMessage";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { OtpInput } from "../components/ui/otp-input";
import { PasswordInput } from "../components/ui/password-input";
import { forgotPassword, resetPassword } from "../lib/auth-api";
import { isValidEmail, PASSWORD_RULES, readPendingEmail, rememberPendingEmail } from "../lib/auth";
import { getErrorMessage } from "../lib/errors";
import { PasswordRules } from "../components/ui/password-rules";
import { ui } from "../lib/ui";

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState(readPendingEmail());
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resent, setResent] = useState(false);

  const requestMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      rememberPendingEmail(email.trim());
      setStep("reset");
    },
  });

  const resetMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      navigate("/signin");
    },
  });

  const onRequest = (event: FormEvent) => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setErrors({ email: "Enter a valid email" });
      return;
    }
    setErrors({});
    setResent(false);
    requestMutation.mutate({ email: email.trim() });
  };

  const onReset = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (otp.length !== 6) {
      nextErrors.otp = "Enter the 6-digit code";
    }
    if (PASSWORD_RULES.some((rule) => !rule.test(newPassword))) {
      nextErrors.newPassword = "Password does not meet the required rules";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    setResent(false);
    resetMutation.mutate({ email: email.trim(), otp, newPassword });
  };

  const onResend = () => {
    setResent(false);
    setErrors({});
    requestMutation.mutate(
      { email: email.trim() },
      {
        onSuccess: () => {
          setOtp("");
          setResent(true);
        },
      },
    );
  };

  const onUseDifferentEmail = () => {
    requestMutation.reset();
    resetMutation.reset();
    setErrors({});
    setOtp("");
    setNewPassword("");
    setResent(false);
    setStep("request");
  };

  if (step === "reset") {
    const resetStepError = resetMutation.isError
      ? getErrorMessage(resetMutation.error)
      : requestMutation.isError
        ? getErrorMessage(requestMutation.error)
        : undefined;

    return (
      <AuthCard
        title="Set a new password"
        subtitle={`Enter the code sent to ${email} and choose a stronger password.`}
        footer={
          <>
            Remembered it?{" "}
            <Link to="/signin" className={ui.authLink}>
              Back to sign in
            </Link>
          </>
        }
      >
        <form className="flex flex-col gap-3" onSubmit={onReset}>
          <div className="flex flex-col gap-1.5">
            <p className={ui.label}>Verification code</p>
            <OtpInput value={otp} onChange={setOtp} error={errors.otp} />
          </div>
          <PasswordInput
            label="New password"
            autoComplete="new-password"
            value={newPassword}
            error={errors.newPassword}
            onChange={setNewPassword}
          />
          <PasswordRules password={newPassword} />
          {resent && !resetStepError ? (
            <p className="text-xs text-emerald-600 dark:text-emerald-400">A new code has been sent to your email.</p>
          ) : null}
          <FormMessage message={resetStepError} />
          <Button type="submit" variant="primary" title="Update password" fullWidth loading={resetMutation.isPending} />
          <Button
            type="button"
            variant="secondary"
            title="Resend code"
            fullWidth
            loading={requestMutation.isPending}
            onClick={onResend}
          />
          <button
            type="button"
            onClick={onUseDifferentEmail}
            className="text-center text-xs font-semibold text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 transition-colors cursor-pointer py-1"
          >
            Use a different email
          </button>
        </form>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Change password"
      subtitle="We’ll email a verification code so you can reset access to your brain."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/signin" className={ui.authLink}>
            Back to sign in
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-3" onSubmit={onRequest}>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          error={errors.email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <FormMessage message={requestMutation.isError ? getErrorMessage(requestMutation.error) : undefined} />
        <Button type="submit" variant="primary" title="Send reset code" fullWidth loading={requestMutation.isPending} />
      </form>
    </AuthCard>
  );
}