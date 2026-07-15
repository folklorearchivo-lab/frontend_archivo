import { useState } from 'react'
import Layout from './components/Layout'
import Dashboard from './components/pages/Dashboard'
import UsersManagement from './components/pages/UsersManagement'
import CultoresDirectory from './components/pages/CultoresDirectory'
import PreRegistration from './components/pages/PreRegistration'
import InventarioPatrimonial from './components/pages/InventarioPatrimonial'
import ConfiguracionPortal from './components/pages/ConfiguracionPortal'
import ReportesCatalogo from './components/pages/ReportesCatalogo'
import ManualAdmin from './components/pages/ManualAdmin'
import ManagementRooms from './components/pages/ManagementRooms'
import Login from './components/pages/Login'
import ForgotPassword from './components/pages/ForgotPassword'
import ResetPassword from './components/pages/ResetPassword'
import { ToastProvider } from './context/ToastContext'
import Toast from './components/Toast'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('user-authenticated') === 'true'
  })
  const [currentView, setCurrentView] = useState('dashboard')

  const handleLogin = (data) => {
    localStorage.setItem('user-authenticated', 'true')
    if (data?.token) {
      localStorage.setItem('auth-token', data.token)
    }
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('user-authenticated')
    localStorage.removeItem('auth-token')
    setIsAuthenticated(false)
  }

  // Sin router: "rutas" resueltas manualmente por hash (#/olvide-password, etc.).
  // Cada navegación entre estas vistas es una recarga completa (<a href>,
  // window.location.href), no SPA.
  const hash = window.location.hash.slice(1) || '/'

  return (
    <ToastProvider>
      {hash.startsWith('/recuperar-password') ? (
        <ResetPassword />
      ) : hash.startsWith('/olvide-password') ? (
        <ForgotPassword onBack={() => { window.location.href = '/' }} />
      ) : !isAuthenticated ? (
        <Login onLoginSuccess={handleLogin} />
      ) : (
        <Layout currentView={currentView} onViewChange={setCurrentView} onLogout={handleLogout}>
          {currentView === 'dashboard' && <Dashboard onNavigate={setCurrentView} />}
          {currentView === 'usuarios' && <UsersManagement />}
          {currentView === 'cultores' && <CultoresDirectory />}
          {currentView === 'preregistro' && <PreRegistration />}
          {currentView === 'patrimonio' && <InventarioPatrimonial />}
          {currentView === 'difusion' && <ConfiguracionPortal />}
          {currentView === 'reportes' && <ReportesCatalogo />}
          {currentView === 'manual' && <ManualAdmin />}
          {currentView === 'salas' && <ManagementRooms />}
        </Layout>
      )}
      <Toast />
    </ToastProvider>
  )
}

export default App
