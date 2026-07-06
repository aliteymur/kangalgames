import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { registerSW } from './pwa.js'
import './index.css'

// Inside the native (Capacitor) app, open straight into the game.
if (window.Capacitor?.isNativePlatform?.()) {
  location.replace('game.html')
} else {
  registerSW()
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
