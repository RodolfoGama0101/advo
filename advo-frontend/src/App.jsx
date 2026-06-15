import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { router } from './routes'
import { useAuthStore } from './stores/authStore'
import { useTokenWatcher } from './hooks/useTokenWatcher'

function AppRoot() {
  useTokenWatcher()
  return (
    <>
      <RouterProvider router={router} />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-bg-elevated)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
            boxShadow: 'var(--shadow-md)'
          },
          success: {
            iconTheme: {
              primary: 'var(--color-success)',
              secondary: '#ffffff'
            }
          },
          error: {
            iconTheme: {
              primary: 'var(--color-danger)',
              secondary: '#ffffff'
            }
          }
        }}
      />
    </>
  )
}

function App() {
  const initializeAuth = useAuthStore(state => state.initialize)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return <AppRoot />
}

export default App
