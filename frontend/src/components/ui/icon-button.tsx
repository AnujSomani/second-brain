import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { ui } from "../../lib/ui";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function IconButton({ children, className, type = "button", ...props }: IconButtonProps) {
  return (
    <button type={type} className={cn(ui.iconBtn, className)} {...props}>
      {children}
    </button>
  );
}
