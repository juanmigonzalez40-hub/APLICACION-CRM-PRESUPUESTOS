import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BudgetProvider } from './context/BudgetContext'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BudgetProvider>
      <App />
    </BudgetProvider>
  </StrictMode>,
)
