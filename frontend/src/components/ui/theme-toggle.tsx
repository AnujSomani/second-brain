import { useTheme } from "../../context/ThemeContext";
import { MoonIcon, SunIcon } from "../../icons";
import { IconButton } from "./icon-button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <IconButton
      onClick={toggleTheme}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
    </IconButton>
  );
}
