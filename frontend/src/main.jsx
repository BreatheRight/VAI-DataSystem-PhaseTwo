// Import the fonts for this project
import '@fontsource/hanken-grotesk/300.css';  // Body Light
import '@fontsource/hanken-grotesk/400.css';  // Body Regular
import '@fontsource/hanken-grotesk/500.css';  // Body Medium
import '@fontsource/hanken-grotesk/600.css';  // Body SemiBold
import '@fontsource/hanken-grotesk/700.css';  // Body Bold
import '@fontsource/inter/400.css';           // Heading Regular
import '@fontsource/inter/500.css';           // Heading Medium
import '@fontsource/inter/600.css';           // Heading SemiBold
import '@fontsource/inter/700.css';           // Heading Bold
import '@fontsource/inter/800.css';           // Heading Extra Bold

// Import Tailwind CSS
import './styles/tailwind-base.css';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
