import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AuthCard } from "../components/auth/AuthCard";
import { FormMessage } from "../components/auth/FormMessage";
import { GoogleButton } from "../components/auth/GoogleButton";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { PasswordInput } from "../components/ui/password-input";
import { signin } from "../lib/auth-api";
import { isValidEmail, rememberPendingEmail, saveUserEmail } from "../lib/auth";
import { ApiError } from "../lib/api";
import { getErrorMessage } from "../lib/errors";
import { ui } from "../lib/ui";

export function SigninPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: signin,
    onSuccess: () => {
      saveUserEmail(email.trim());
      navigate("/brain");
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 403) {
        rememberPendingEmail(email.trim());
        navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`);
      }
    },
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!isValidEmail(email)) {
      nextErrors.email = "Enter a valid email";
    }
    if (!password) {
      nextErrors.password = "Password is required";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    mutation.mutate({ email: email.trim(), password });
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to reopen the thoughts, links, and notes stored in your brain."
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className={ui.authLink}>
            Create an account
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          error={errors.email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          value={password}
          error={errors.password}
          onChange={setPassword}
        />
        <div className="flex justify-end">
          <Link to="/change-password" className={`text-sm font-medium ${ui.authLink}`}>
            Forget password
          </Link>
        </div>
        <FormMessage
          message={
            mutation.isError && !(mutation.error instanceof ApiError && mutation.error.status === 403)
              ? getErrorMessage(mutation.error)
              : undefined
          }
        />
        <Button type="submit" variant="primary" title="Sign in" fullWidth loading={mutation.isPending} />
        <GoogleButton title="Continue with Google" />
      </form>
    </AuthCard>
  );
}