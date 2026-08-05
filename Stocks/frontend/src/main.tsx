import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { PremiumProvider } from './context/PremiumContext'
import App from './App'
import './index.css'
import './firebase'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PremiumProvider>
        <App />
      </PremiumProvider>
    </BrowserRouter>
  </StrictMode>
)
