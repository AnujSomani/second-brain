import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { ui } from "../lib/ui";

interface AppShellProps {
  sidebarOpen: boolean;
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function AppShell({ sidebarOpen, sidebar, header, children, footer }: AppShellProps) {
  return (
    <div className={cn(ui.page, "flex")}>
      {sidebar}
      <div
        className={cn(
          "flex flex-col flex-1 min-h-screen transition-all duration-300",
          sidebarOpen ? "lg:pl-64" : "lg:pl-16",
        )}
      >
        <header className={ui.header}>{header}</header>
        {children}
        {footer}
      </div>
    </div>
  );
}
