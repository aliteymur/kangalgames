import React from 'react'
import ReactDOM from 'react-dom/client'
import GuardianGame from './GuardianGame.jsx'
import { registerSW } from './pwa.js'
import './index.css'

registerSW()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GuardianGame standalone />
  </React.StrictMode>,
)
