import React, { useState, useEffect } from 'react'
import { Lock, Eye, EyeOff, Save, X, User, Mail, Shield } from 'lucide-react'
import { changePasswordRequest } from '../services/api'
import './pages/UsersManagement.css'

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Limpiar campos al abrir/cerrar
  useEffect(() => {
    if (!isOpen) {
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setError('')
      setSuccess('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden.')
      return
    }

    if (newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.')
      return
    }

    const token = localStorage.getItem('auth-token')
    if (!token) {
      setError('No hay sesión activa. Por favor inicie sesión nuevamente.')
      return
    }

    setLoading(true)
    try {
      const data = await changePasswordRequest(currentPassword, newPassword, token)
      setSuccess(data.message || 'Contraseña actualizada con éxito.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      
      // Auto cerrar el modal después de 2 segundos de éxito
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      setError(err?.message || 'Error al cambiar la contraseña.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2>Mi Perfil</h2>
          <button className="close-modal-btn" onClick={onClose} aria-label="Cerrar modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ paddingBottom: '10px' }}>
          {/* Información del Perfil (Solo vista) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
             <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#1e293b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>
               AD
             </div>
             <div>
               <h4 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '16px' }}>Administrador</h4>
               <p style={{ margin: '0', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                 <Shield size={14} /> Sede Principal
               </p>
             </div>
          </div>

          <h3 style={{ fontSize: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '15px' }}>Cambiar Contraseña</h3>

          {error && <div className="form-error-banner" style={{ marginBottom: '15px' }}>{error}</div>}
          {success && <div style={{ color: '#15803d', backgroundColor: '#f0fdf4', border: '1px solid #4ade80', padding: '10px', borderRadius: '6px', fontSize: '14px', marginBottom: '15px' }}>{success}</div>}
          
          <form onSubmit={handleSubmit} id="change-password-form">
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="current-password">Contraseña Actual <span className="required">*</span></label>
              <div className="input-with-icon" style={{ position: 'relative' }}>
                <Lock size={16} className="input-icon" />
                <input 
                  type={showCurrent ? 'text' : 'password'} 
                  id="current-password" 
                  placeholder="Ingresa tu contraseña actual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="new-password">Nueva Contraseña <span className="required">*</span></label>
              <div className="input-with-icon" style={{ position: 'relative' }}>
                <Lock size={16} className="input-icon" />
                <input 
                  type={showNew ? 'text' : 'password'} 
                  id="new-password" 
                  placeholder="Mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowNew(!showNew)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="confirm-password">Confirmar Nueva Contraseña <span className="required">*</span></label>
              <div className="input-with-icon" style={{ position: 'relative' }}>
                <Lock size={16} className="input-icon" />
                <input 
                  type={showConfirm ? 'text' : 'password'} 
                  id="confirm-password" 
                  placeholder="Repite la nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" form="change-password-form" className="btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Actualizar Contraseña'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordModal
