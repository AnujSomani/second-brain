import { useState } from "react";
import { Input } from "./input";

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  autoComplete?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function PasswordInput({
  label,
  value,
  onChange,
  error,
  hint,
  autoComplete,
  placeholder = "••••••••",
  disabled,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      label={label}
      type={visible ? "text" : "password"}
      value={value}
      autoComplete={autoComplete}
      placeholder={placeholder}
      disabled={disabled}
      error={error}
      hint={hint}
      onChange={(event) => onChange(event.target.value)}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="rounded-lg px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-200/80 hover:text-purple-800 dark:hover:text-white transition-colors"
        >
          {visible ? "Hide" : "Show"}
        </button>
      }
    />
  );
}
