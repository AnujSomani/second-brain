interface FormMessageProps {
  message?: string;
  tone?: "error" | "success";
}

export function FormMessage({ message, tone = "error" }: FormMessageProps) {
  if (!message) {
    return null;
  }

  const classes =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-200"
      : "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-400/25 dark:bg-rose-400/10 dark:text-rose-200";

  return <p className={`rounded-xl border px-3 py-2 text-sm ${classes}`}>{message}</p>;
}