import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"

export function ThemeToggle({ className }) {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: 8,
        background: 'var(--glass)',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        color: 'var(--text)',
        transition: 'all 0.2s ease',
      }}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun size={18} style={{ color: '#ffd700' }} />
      ) : (
        <Moon size={18} style={{ color: '#9d4edd' }} />
      )}
    </button>
  )
}
