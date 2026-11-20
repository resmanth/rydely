/**
 * main.jsx — Entry point of the React application.
 *
 * This file mounts the root <App /> component into the HTML element
 * with id="root" (defined in index.html). React.StrictMode is enabled
 * so React warns us about unsafe practices during development.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// --- Mount the App into the DOM ---
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
