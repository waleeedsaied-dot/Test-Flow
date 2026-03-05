import * as React from "react"

const ThemeContext = React.createContext({
  theme: "dark",
  setTheme: () => null,
})

export function ThemeProvider({ children, defaultTheme = "dark", ...props }) {
  const [theme, setTheme] = React.useState(
    () => localStorage.getItem("theme") || defaultTheme
  )

  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  return (
    <ThemeContext.Provider {...props} value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
