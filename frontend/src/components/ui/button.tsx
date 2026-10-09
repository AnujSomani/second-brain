import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

type ButtonVariant = "primary" | "secondary" | "inverse" | "danger" | "google";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant: ButtonVariant;
  title: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "!bg-gradient-to-r !from-purple-600 !to-violet-600 hover:!from-purple-500 hover:!to-violet-500 !text-white shadow-md shadow-purple-600/25 hover:shadow-lg hover:shadow-purple-600/40 active:scale-[0.99] cursor-pointer transition-all duration-200",
  secondary:
    "bg-white dark:bg-panel text-slate-800 dark:text-slate-100 border-2 border-slate-200/90 dark:border-purple-800/70 hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50/40 dark:hover:bg-inset shadow-xs hover:shadow-sm font-bold cursor-pointer transition-all duration-200",
  google:
    "bg-white text-slate-700 border-2 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 shadow-sm hover:shadow-md font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2.5",
  inverse:
    "bg-white text-purple-700 border-2 border-white hover:bg-purple-50 hover:text-purple-900 cursor-pointer shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200",
  danger:
    "border-2 border-rose-200 dark:border-rose-900/50 bg-rose-50/70 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01] transition-all",
};

export function Button({
  variant,
  title,
  startIcon,
  endIcon,
  loading = false,
  fullWidth = false,
  className,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold",
        "transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-page",
        "disabled:cursor-not-allowed disabled:opacity-70",
        fullWidth && "w-full",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        startIcon
      )}
      <span>{loading ? "Please wait" : title}</span>
      {!loading ? endIcon : null}
    </button>
  );
}