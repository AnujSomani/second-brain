import { type FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AuthCard } from "../components/auth/AuthCard";
import { FormMessage } from "../components/auth/FormMessage";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { OtpInput } from "../components/ui/otp-input";
import { resendOtp, verifyEmail } from "../lib/auth-api";
import { isValidEmail, readPendingEmail, rememberPendingEmail } from "../lib/auth";
import { getErrorMessage } from "../lib/errors";
import { ui } from "../lib/ui";

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? readPendingEmail());
  const [otp, setOtp] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");

  const verifyMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      setTimeout(() => {
        navigate("/brain");
      }, 100);
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendOtp,
    onSuccess: () => {
      setOtp("");
    },
  });

  const canResend = useMemo(() => isValidEmail(email), [email]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextEmailError = isValidEmail(email) ? "" : "Enter a valid email";
    const nextOtpError = otp.length === 6 ? "" : "Enter the 6-digit code";
    setEmailError(nextEmailError);
    setOtpError(nextOtpError);
    if (nextEmailError || nextOtpError) {
      return;
    }
    rememberPendingEmail(email.trim());
    verifyMutation.mutate({ email: email.trim(), otp });
  };

  return (
    <AuthCard
      title="Verify your email"
      subtitle="We sent a 6-digit code to your inbox. Enter it to unlock your brain."
      footer={
        <>
          Wrong account?{" "}
          <Link to="/signup" className={ui.authLink}>
            Go back to signup
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          error={emailError}
          onChange={(event) => setEmail(event.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <p className={ui.label}>Verification code</p>
          <OtpInput value={otp} onChange={setOtp} error={otpError} disabled={verifyMutation.isPending} />
        </div>
        <FormMessage
          message={
            verifyMutation.isError
              ? getErrorMessage(verifyMutation.error)
              : resendMutation.isError
                ? getErrorMessage(resendMutation.error)
                : undefined
          }
        />
        <FormMessage
          tone="success"
          message={resendMutation.isSuccess ? "A new code is on its way." : undefined}
        />
        <Button type="submit" variant="primary" title="Verify email" fullWidth loading={verifyMutation.isPending} />
        <Button
          type="button"
          variant="secondary"
          title="Resend code"
          fullWidth
          disabled={!canResend}
          loading={resendMutation.isPending}
          onClick={() => {
            if (!canResend) {
              return;
            }
            rememberPendingEmail(email.trim());
            resendMutation.mutate({ email: email.trim() });
          }}
        />
      </form>
    </AuthCard>
  );
}