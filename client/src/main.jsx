import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/styles/main.css'
import App from './App.jsx'
import './utils/i18n.js'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
