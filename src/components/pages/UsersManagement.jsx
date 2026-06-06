import React, { useState } from 'react'
import {
  Search,
  Plus,
  User,
  Mail,
  Shield,
  Trash2,
  X,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  UserX
} from 'lucide-react'
import './UsersManagement.css'

const UsersManagement = () => {
  // Initial list of mock users
  const [users, setUsers] = useState([
    { id: 1, name: 'Juan R. Castañeda', email: 'juan.castaneda@folklore.org', role: 'cultor', status: 'activo' },
    { id: 2, name: 'María Sosa - "El Rezo"', email: 'maria.sosa@folklore.org', role: 'cultor', status: 'activo' },
    { id: 3, name: 'Carlos Delgado', email: 'carlos.delgado@admin.folklore.org', role: 'admin', status: 'activo' },
    { id: 4, name: 'Elena Méndez', email: 'elena.mendez@investigacion.org', role: 'investigador', status: 'inactivo' },
    { id: 5, name: 'Ramón Rivera', email: 'ramon.rivera@folklore.org', role: 'investigador', status: 'activo' },
    { id: 6, name: 'Ana Teresa Hernández', email: 'ana.hernandez@folklore.org', role: 'cultor', status: 'inactivo' }
  ])

  // Filters state
  const [roleFilter, setRoleFilter] = useState('todos')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserRole, setNewUserRole] = useState('cultor')
  const [newUserStatus, setNewUserStatus] = useState('activo')
  const [formError, setFormError] = useState('')

  // Toggle user status between active and inactive
  const handleToggleStatus = (id) => {
    setUsers(users.map(user => {
      if (user.id === id) {
        return {
          ...user,
          status: user.status === 'activo' ? 'inactivo' : 'activo'
        }
      }
      return user
    }))
  }

  // Delete user from list
  const handleDeleteUser = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      setUsers(users.filter(user => user.id !== id))
    }
  }

  // Handle modal submit
  const handleCreateUserSubmit = (e) => {
    e.preventDefault()

    if (!newUserName.trim() || !newUserEmail.trim()) {
      setFormError('Por favor completa todos los campos obligatorios.')
      return
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newUserEmail)) {
      setFormError('Por favor ingresa un correo electrónico válido.')
      return
    }

    const newUser = {
      id: Date.now(),
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: newUserStatus
    }

    setUsers([newUser, ...users])
    
    // Reset form and close modal
    setNewUserName('')
    setNewUserEmail('')
    setNewUserRole('cultor')
    setNewUserStatus('activo')
    setFormError('')
    setIsModalOpen(false)
  }

  // Filtered users
  const filteredUsers = users.filter(user => {
    const matchesRole = roleFilter === 'todos' || user.role === roleFilter
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesRole && matchesSearch
  })

  // Get initials for profile badge
  const getInitials = (name) => {
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <div className="users-module-container">
      {/* Header and Action */}
      <div className="page-header">
        <div className="breadcrumbs-title">
          <nav className="breadcrumbs">
            <span>ARCHIVO</span>
            <span className="separator">&gt;</span>
            <span className="current">GESTIÓN DE USUARIOS</span>
          </nav>
          <h1>Gestión de Usuarios</h1>
        </div>

        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Crear Usuario</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <section className="filter-controls-card">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${roleFilter === 'todos' ? 'active' : ''}`}
            onClick={() => setRoleFilter('todos')}
          >
            Todos
          </button>
          <button 
            className={`filter-tab ${roleFilter === 'admin' ? 'active' : ''}`}
            onClick={() => setRoleFilter('admin')}
          >
            Administradores
          </button>
          <button 
            className={`filter-tab ${roleFilter === 'cultor' ? 'active' : ''}`}
            onClick={() => setRoleFilter('cultor')}
          >
            Cultores
          </button>
          <button 
            className={`filter-tab ${roleFilter === 'investigador' ? 'active' : ''}`}
            onClick={() => setRoleFilter('investigador')}
          >
            Investigadores
          </button>
        </div>

        <div className="search-box-wrapper">
          <Search className="search-box-icon" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o correo..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')} aria-label="Limpiar búsqueda">
              <X size={14} />
            </button>
          )}
        </div>
      </section>

      {/* Users List Card */}
      <div className="card users-list-card">
        <div className="users-card-header">
          <h3>Usuarios Registrados ({filteredUsers.length})</h3>
        </div>

        {filteredUsers.length > 0 ? (
          <div className="table-responsive">
            <table className="users-table">
              <thead>
                <tr>
                  <th>USUARIO</th>
                  <th>CORREO ELECTRÓNICO</th>
                  <th>ROL DE ACCESO</th>
                  <th>ESTATUS</th>
                  <th className="text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-profile-cell">
                        <div className={`user-initials-badge ${
                          user.role === 'admin' ? 'role-admin-badge' : 
                          user.role === 'cultor' ? 'role-cultor-badge' : 'role-investigador-badge'
                        }`}>
                          {getInitials(user.name)}
                        </div>
                        <span className="user-display-name">{user.name}</span>
                      </div>
                    </td>
                    <td className="user-email-cell">{user.email}</td>
                    <td>
                      <span className={`role-tag ${user.role}`}>
                        {user.role === 'admin' ? 'Administrador' : 
                         user.role === 'cultor' ? 'Cultor' : 'Investigador'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        <span className="status-dot"></span>
                        {user.status === 'activo' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="table-actions-row">
                        <button 
                          className="action-btn toggle-status"
                          onClick={() => handleToggleStatus(user.id)}
                          title={user.status === 'activo' ? 'Desactivar usuario' : 'Activar usuario'}
                        >
                          {user.status === 'activo' ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                        <button 
                          className="action-btn delete-user"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Eliminar usuario"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <User size={48} className="empty-icon" />
            <p className="empty-title">No se encontraron usuarios</p>
            <p className="empty-description">Intenta cambiar el término de búsqueda o selecciona otra categoría.</p>
          </div>
        )}
      </div>

      {/* Creation Modal Overlay */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>Crear Nuevo Usuario</h2>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)} aria-label="Cerrar modal">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit}>
              <div className="modal-body">
                {formError && <div className="form-error-banner">{formError}</div>}
                
                <div className="form-group">
                  <label htmlFor="user-name">Nombre Completo <span className="required">*</span></label>
                  <div className="input-with-icon">
                    <User size={16} className="input-icon" />
                    <input 
                      type="text" 
                      id="user-name" 
                      placeholder="Ej. Juan R. Castañeda"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="user-email">Correo Electrónico <span className="required">*</span></label>
                  <div className="input-with-icon">
                    <Mail size={16} className="input-icon" />
                    <input 
                      type="email" 
                      id="user-email" 
                      placeholder="Ej. juan.castaneda@folklore.org"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-grid">
                  <div className="form-group">
                    <label htmlFor="user-role">Rol de Acceso</label>
                    <div className="input-with-icon">
                      <Shield size={16} className="input-icon" />
                      <select 
                        id="user-role"
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value)}
                      >
                        <option value="admin">Administrador</option>
                        <option value="cultor">Cultor</option>
                        <option value="investigador">Investigador</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="user-status">Estatus Inicial</label>
                    <div className="input-with-icon">
                      <UserCheck size={16} className="input-icon" />
                      <select 
                        id="user-status"
                        value={newUserStatus}
                        onChange={(e) => setNewUserStatus(e.target.value)}
                      >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersManagement
