// Import the fonts for this project - Material Design 3 typography
import '@fontsource/hanken-grotesk/300.css';  // Light
import '@fontsource/hanken-grotesk/400.css';  // Regular
import '@fontsource/hanken-grotesk/500.css';  // Medium
import '@fontsource/hanken-grotesk/600.css';  // SemiBold
import '@fontsource/hanken-grotesk/700.css';  // Bold
import '@fontsource/bebas-neue/400.css';      // Bebas Neue (headings)
import '@fontsource/ibm-plex-sans/300.css';   // IBM Plex Sans Light
import '@fontsource/ibm-plex-sans/400.css';   // IBM Plex Sans Regular
import '@fontsource/ibm-plex-sans/500.css';   // IBM Plex Sans Medium
import '@fontsource/ibm-plex-sans/600.css';   // IBM Plex Sans SemiBold
import '@fontsource/inter/400.css';           // Inter Regular (fallback)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
