import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@/hooks/use-theme'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" attribute="class" enableSystem={false}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
