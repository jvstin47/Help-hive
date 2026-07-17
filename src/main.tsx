import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { RequestsProvider } from './contexts/RequestsContext'
import 'leaflet/dist/leaflet.css'
import { router } from './app/router'
import { initDarkMode } from './utils/darkMode'
import { MotionConfig } from 'framer-motion'

// Apply saved dark mode preference before first render
initDarkMode();

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RequestsProvider>
          <MotionConfig reducedMotion="user">
            <RouterProvider router={router} />
          </MotionConfig>
        </RequestsProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
