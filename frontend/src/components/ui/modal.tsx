import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { ui } from "../../lib/ui";
import { CloseIcon } from "../../icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, footer, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "relative w-full max-w-md animate-[modalIn_0.25s_ease-out] rounded-3xl border border-line bg-panel shadow-2xl shadow-purple-950/40",
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          <button type="button" onClick={onClose} className={ui.close} aria-label="Close">
            <CloseIcon className="size-5" />
          </button>
        </div>
        {children}
        {footer ? <div className="border-t border-line px-6 py-4 flex justify-end gap-3">{footer}</div> : null}
      </div>
    </div>
  );
}