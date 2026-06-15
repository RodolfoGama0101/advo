import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { MainLayout } from '../components/layout/MainLayout'
import { ForbiddenPage } from '../components/feedback/ForbiddenPage'
import { SessionExpiredModal } from '../components/feedback/SessionExpiredModal'

// Lazy / direct page imports (stubs to be built)
import { LoginPage } from '../features/auth/components/LoginPage'
import { RegisterPage } from '../features/auth/components/RegisterPage'
import { RegisterUserForm } from '../features/auth/components/RegisterUserForm'
import { DashboardPage } from '../features/dashboard/components/DashboardPage'
import { ClientesListPage } from '../features/clientes/components/ClientesListPage'
import { ClienteFormPage } from '../features/clientes/components/ClienteFormPage'
import { ClienteDetailPage } from '../features/clientes/components/ClienteDetailPage'
import { ProcessosListPage } from '../features/processos/components/ProcessosListPage'
import { ProcessoFormPage } from '../features/processos/components/ProcessoFormPage'
import { ProcessoDetailPage } from '../features/processos/components/ProcessoDetailPage'
import { AgendaPage } from '../features/agenda/components/AgendaPage'
import { TarefasKanbanPage } from '../features/tarefas/components/TarefasKanbanPage'
import { DocumentosPage } from '../features/documentos/components/DocumentosPage'
import { FinanceiroPage } from '../features/financeiro/components/FinanceiroPage'
import { useAuthStore } from '../stores/authStore'

const HomeRedirect = () => {
  const { role } = useAuthStore()
  if (role === 'ADMIN' || role === 'ADVOGADO') {
    return <Navigate to="/dashboard" replace />
  }
  return <Navigate to="/clientes" replace />
}

const RootLayout = () => {
  return (
    <>
      <SessionExpiredModal />
      <Outlet />
    </>
  )
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/registro',
        element: <RegisterPage />
      },
      {
        path: '/403',
        element: <ForbiddenPage />
      },
      {
        path: '/',
        element: <ProtectedRoute allowedRoles={['ADMIN', 'ADVOGADO', 'ESTAGIARIO', 'SECRETARIA']} />,
        children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <HomeRedirect />
          },
          {
            path: 'dashboard',
            element: <ProtectedRoute allowedRoles={['ADMIN', 'ADVOGADO']} />,
            children: [
              { index: true, element: <DashboardPage /> }
            ]
          },
          {
            path: 'clientes',
            children: [
              { index: true, element: <ClientesListPage /> },
              { path: 'novo', element: <ProtectedRoute allowedRoles={['ADMIN', 'ADVOGADO', 'SECRETARIA']} />, children: [{ index: true, element: <ClienteFormPage /> }] },
              { path: 'editar/:id', element: <ProtectedRoute allowedRoles={['ADMIN', 'ADVOGADO', 'SECRETARIA']} />, children: [{ index: true, element: <ClienteFormPage /> }] },
              { path: ':id', element: <ClienteDetailPage /> }
            ]
          },
          {
            path: 'processos',
            children: [
              { index: true, element: <ProcessosListPage /> },
              { path: 'novo', element: <ProtectedRoute allowedRoles={['ADMIN', 'ADVOGADO']} />, children: [{ index: true, element: <ProcessoFormPage /> }] },
              { path: ':id', element: <ProcessoDetailPage /> }
            ]
          },
          {
            path: 'agenda',
            element: <AgendaPage />
          },
          {
            path: 'tarefas',
            element: <TarefasKanbanPage />
          },
          {
            path: 'documentos',
            element: <DocumentosPage />
          },
          {
            path: 'financeiro',
            element: <ProtectedRoute allowedRoles={['ADMIN', 'ADVOGADO']} />,
            children: [
              { index: true, element: <FinanceiroPage /> }
            ]
          },
          {
            path: 'usuarios',
            element: <ProtectedRoute allowedRoles={['ADMIN']} />,
            children: [
              { index: true, element: <RegisterUserForm /> }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
    ]
  }
])
