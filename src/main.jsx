import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./1app/styles/mainStyle.scss"
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <App />
)
