import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { theme } from './theme/tokens'
import './index.css'
import { pwaController } from './services/pwa/controller'

void pwaController.start(import.meta.env.PROD && import.meta.env.BASE_URL === '/')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <a className="skip-link" href="#main-content" onClick={event => {
      const main = document.getElementById('main-content')
      if (main) { event.preventDefault(); main.focus() }
    }} style={{top:theme.spacing.sm,left:theme.spacing.sm,
      zIndex:theme.layers.skipLink,background:theme.colors.primary,color:theme.colors.primaryText,
      padding:theme.spacing.md,borderRadius:theme.radius.sm}}>Đến nội dung chính</a>
    <App />
  </React.StrictMode>,
)
