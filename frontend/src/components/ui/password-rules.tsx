import { PASSWORD_RULES } from "../../lib/auth";
import { cn } from "../../lib/cn";

export function PasswordRules({ password }: { password: string }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
      {PASSWORD_RULES.map((rule) => {
        const passed = rule.test(password);
        return (
          <li
            key={rule.id}
            className={cn(passed ? "font-semibold text-emerald-600 dark:text-emerald-400" : "text-muted")}
          >
            {passed ? "✓" : "•"} {rule.label}
          </li>
        );
      })}
    </ul>
  );
}