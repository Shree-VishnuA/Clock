import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <div
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
        isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-300 hover:bg-gray-400"
      }`}
    >
      {/* Toggle Thumb */}
      <span
        className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
          isDark ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {/* Sun Icon */}
        <Sun
          className={`w-3.5 h-3.5 text-yellow-500 transition-opacity transform duration-300 ${
            isDark ? "opacity-0 scale-0 rotate-90" : "opacity-100 scale-100 rotate-0"
          }`}
        />
        {/* Moon Icon */}
        <Moon
          className={`w-3.5 h-3.5 text-gray-700 absolute transition-opacity transform duration-300 ${
            isDark ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-0 -rotate-90"
          }`}
        />
      </span>
    </div>
  )
}
