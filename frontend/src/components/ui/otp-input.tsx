import { useMemo, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "../../lib/cn";
import { ui } from "../../lib/ui";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  error?: string;
}

export function OtpInput({ value, onChange, length = 6, disabled, error }: OtpInputProps) {
  const digits = useMemo(() => {
    const next = value.replace(/\D/g, "").slice(0, length).split("");
    return Array.from({ length }, (_, index) => next[index] ?? "");
  }, [value, length]);

  const focusBox = (index: number) => {
    const el = document.getElementById(`otp-${index}`);
    el?.focus();
  };

  const updateAt = (index: number, digit: string) => {
    const next = [...digits];
    next[index] = digit;
    onChange(next.join(""));
  };

  const onKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      updateAt(index - 1, "");
      focusBox(index - 1);
    }
    if (event.key === "ArrowLeft") {
      focusBox(Math.max(0, index - 1));
    }
    if (event.key === "ArrowRight") {
      focusBox(Math.min(length - 1, index + 1));
    }
  };

  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between gap-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            disabled={disabled}
            value={digit}
            onPaste={onPaste}
            onKeyDown={(event) => onKeyDown(index, event)}
            onChange={(event) => {
              const nextDigit = event.target.value.replace(/\D/g, "").slice(-1);
              updateAt(index, nextDigit);
              if (nextDigit && index < length - 1) {
                focusBox(index + 1);
              }
            }}
            className={cn(
              ui.field,
              "h-12 px-0 text-center text-lg font-bold disabled:cursor-not-allowed disabled:opacity-60",
              error ? ui.fieldError : undefined,
            )}
          />
        ))}
      </div>
      {error ? <p className="text-xs font-medium text-rose-500 dark:text-rose-400">{error}</p> : null}
    </div>
  );
}