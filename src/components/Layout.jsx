import React from 'react'
import {
  Search,
  Calendar,
  Bell,
  LayoutDashboard,
  UserCheck,
  Users,
  Landmark,
  Image as ImageIcon,
  FileText
} from 'lucide-react'
import './Layout.css'
import adminAvatar from '../assets/admin_avatar.png'

const Layout = ({ children, currentView, onViewChange }) => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Archivo de Folklore</h2>
          <span className="subtitle">REGIÓN TÁCHIRA</span>
        </div>

        <nav className="sidebar-nav">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`nav-item nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard className="nav-icon" size={20} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => onViewChange('usuarios')}
            className={`nav-item nav-btn ${currentView === 'usuarios' ? 'active' : ''}`}
          >
            <UserCheck className="nav-icon" size={20} />
            <span>Gestión de Usuarios</span>
          </button>
          <button
            onClick={() => onViewChange('cultores')}
            className={`nav-item nav-btn ${currentView === 'cultores' ? 'active' : ''}`}
          >
            <Users className="nav-icon" size={20} />
            <span>Directorio de Cultores</span>
          </button>
          <button
            onClick={() => onViewChange('preregistro')}
            className={`nav-item nav-btn ${currentView === 'preregistro' ? 'active' : ''}`}
          >
            <FileText className="nav-icon" size={20} />
            <span>Pre-registro</span>
          </button>
          <button
            onClick={() => onViewChange('patrimonio')}
            className={`nav-item nav-btn ${currentView === 'patrimonio' ? 'active' : ''}`}
          >
            <Landmark className="nav-icon" size={20} />
            <span>Inventario Patrimonial</span>
          </button>
          <button
            onClick={() => onViewChange('difusion')}
            className={`nav-item nav-btn ${currentView === 'difusion' ? 'active' : ''}`}
          >
            <ImageIcon className="nav-icon" size={20} />
            <span>Difusión y Galería</span>
          </button>
          <button
            onClick={() => onViewChange('reportes')}
            className={`nav-item nav-btn ${currentView === 'reportes' ? 'active' : ''}`}
          >
            <FileText className="nav-icon" size={20} />
            <span>Reportes y Catálogo</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="profile-badge">
            <div className="profile-initials">AD</div>
            <div className="profile-info">
              <span className="profile-name">Administrador</span>
              <span className="profile-location">SEDE PRINCIPAL</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Header */}
        <header className="topbar">
          <div className="search-bar">
            <Search className="search-icon" size={18} />
            <input type="text" placeholder="Buscar cultor u obra..." />
          </div>

          <div className="topbar-actions">
            <button className="icon-btn" aria-label="Calendario">
              <Calendar size={18} />
            </button>
            <button className="icon-btn" aria-label="Notificaciones">
              <Bell size={18} />
              <span className="notif-dot"></span>
            </button>
            <div className="admin-profile">
              <span className="admin-role">Admin</span>
              <img src={adminAvatar} alt="Admin avatar" className="avatar-img" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-body">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
