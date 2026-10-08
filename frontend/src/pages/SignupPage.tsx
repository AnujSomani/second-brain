import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AuthCard } from "../components/auth/AuthCard";
import { FormMessage } from "../components/auth/FormMessage";
import { GoogleButton } from "../components/auth/GoogleButton";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { PasswordInput } from "../components/ui/password-input";
import { signup } from "../lib/auth-api";
import { isValidEmail, PASSWORD_RULES, rememberPendingEmail } from "../lib/auth";
import { getErrorMessage } from "../lib/errors";
import { PasswordRules } from "../components/ui/password-rules";
import { ui } from "../lib/ui";

export function SignupPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      rememberPendingEmail(data.email);
      navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
    },
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (username.trim().length < 2 || username.trim().length > 30) {
      nextErrors.username = "Username must be 2 to 30 characters";
    }
    if (!isValidEmail(email)) {
      nextErrors.email = "Enter a valid email";
    }
    const failedRules = PASSWORD_RULES.filter((rule) => !rule.test(password));
    if (failedRules.length > 0) {
      nextErrors.password = "Password does not meet the required rules";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    mutation.mutate({ username: username.trim(), email: email.trim(), password });
  };

  return (
    <AuthCard
      title="Create your brain"
      subtitle="Save links, notes, and media in one private second brain."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/signin" className={ui.authLink}>
            Sign in
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        <Input
          label="Username"
          autoComplete="username"
          placeholder="anuj"
          value={username}
          error={errors.username}
          onChange={(event) => setUsername(event.target.value)}
        />
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
          autoComplete="new-password"
          value={password}
          error={errors.password}
          onChange={setPassword}
        />
        <PasswordRules password={password} />
        <FormMessage message={mutation.isError ? getErrorMessage(mutation.error) : undefined} />
        <Button type="submit" variant="primary" title="Create account" fullWidth loading={mutation.isPending} />
        <GoogleButton title="Continue with Google" />
      </form>
    </AuthCard>
  );
}
