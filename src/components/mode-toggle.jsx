
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider"; // Adjust path as needed

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
        isDark
          ? "bg-gray-700 hover:bg-gray-600"
          : "bg-gray-300 hover:bg-gray-400"
      }`}
      style={{
        cursor: "pointer",
        width: "3rem",
        height: "1.5rem",
        borderRadius: "9999px",
        position: "relative",
        backgroundColor: isDark ? "#374151" : "#d1d5db",
      }}
    >
      <span
        className={`absolute top-0 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center`}
        style={{
          transform: `translateX(${isDark ? "1.5rem" : "0rem"})`,
          transition: "transform 0.3s ease",
        }}
      >
        <Sun
          className={`absolute w-3.5 h-3.5 text-yellow-500`}
          style={{
            opacity: isDark ? 0 : 1,
            transform: isDark
              ? "scale(0) rotate(90deg)"
              : "scale(1) rotate(0deg)",
            transition: "all 0.3s ease",
          }}
        />
        <Moon
          className={`absolute w-3.5 h-3.5 text-gray-700`}
          style={{
            opacity: isDark ? 1 : 0,
            transform: isDark
              ? "scale(1) rotate(0deg)"
              : "scale(0) rotate(-90deg)",
            transition: "all 0.3s ease",
          }}
        />
      </span>
    </div>
  );
}
