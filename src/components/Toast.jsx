import { useToast } from '../context/ToastContext'
import './Toast.css'

const TIPO_CONFIG = {
  success: {
    tituloColor: '#065f46',
    ringColor: '#10b981',
    ringBg: '#e6f7f0',
    shadowColor: 'rgba(16,185,129,0.2)',
    borderColor: 'rgba(16,185,129,0.1)',
    btnBg: 'linear-gradient(135deg, #10b981, #059669)',
    btnShadow: '0 6px 20px rgba(16,185,129,0.35)',
    btnShadowHover: '0 8px 24px rgba(16,185,129,0.45)',
    progressBg: 'linear-gradient(90deg, #10b981, #34d399, #6ee7b7)',
    pulseBg: 'rgba(16,185,129,0.08)',
    icono: (ringColor, ringBg) => (
      <svg className="toast-modal-svg" viewBox="0 0 80 80" fill="none">
        <circle className="toast-ring-circle" cx="40" cy="40" r="36" stroke={ringColor} strokeWidth="4" fill={ringBg} />
        <path className="toast-check-draw" d="M24 41l11 11 21-24" stroke={ringColor} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },
  error: {
    tituloColor: '#991b1b',
    ringColor: '#ef4444',
    ringBg: '#fef2f2',
    shadowColor: 'rgba(239,68,68,0.2)',
    borderColor: 'rgba(239,68,68,0.1)',
    btnBg: 'linear-gradient(135deg, #ef4444, #dc2626)',
    btnShadow: '0 6px 20px rgba(239,68,68,0.35)',
    btnShadowHover: '0 8px 24px rgba(239,68,68,0.45)',
    progressBg: 'linear-gradient(90deg, #ef4444, #f87171, #fca5a5)',
    pulseBg: 'rgba(239,68,68,0.08)',
    icono: (ringColor, ringBg) => (
      <svg className="toast-modal-svg" viewBox="0 0 80 80" fill="none">
        <circle className="toast-ring-circle" cx="40" cy="40" r="36" stroke={ringColor} strokeWidth="4" fill={ringBg} />
        <path className="toast-check-draw" d="M28 28l24 24M52 28l-24 24" stroke={ringColor} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },
  info: {
    tituloColor: '#1e40af',
    ringColor: '#3b82f6',
    ringBg: '#eff6ff',
    shadowColor: 'rgba(59,130,246,0.2)',
    borderColor: 'rgba(59,130,246,0.1)',
    btnBg: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    btnShadow: '0 6px 20px rgba(59,130,246,0.35)',
    btnShadowHover: '0 8px 24px rgba(59,130,246,0.45)',
    progressBg: 'linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd)',
    pulseBg: 'rgba(59,130,246,0.08)',
    icono: (ringColor, ringBg) => (
      <svg className="toast-modal-svg" viewBox="0 0 80 80" fill="none">
        <circle className="toast-ring-circle" cx="40" cy="40" r="36" stroke={ringColor} strokeWidth="4" fill={ringBg} />
        <path d="M40 28v2m0 8v12" stroke={ringColor} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="40" cy="24" r="2" fill={ringColor} />
      </svg>
    ),
  },
}

function Toast() {
  const { toast, closeToast } = useToast()
  if (!toast) return null

  const config = TIPO_CONFIG[toast.tipo] || TIPO_CONFIG.success

  return (
    <div className="toast-modal-overlay" onClick={closeToast}>
      <div className="toast-modal-box" onClick={e => e.stopPropagation()} style={{ boxShadow: `0 4px 6px -1px rgba(0,0,0,0.07), 0 32px 64px -16px ${config.shadowColor}, 0 0 0 1px ${config.borderColor}` }}>
        <div className="toast-modal-icon-ring" style={{ '--pulse-bg': config.pulseBg }}>
          {config.icono(config.ringColor, config.ringBg)}
        </div>
        <h2 className="toast-modal-title" style={{ color: config.tituloColor }}>{toast.titulo}</h2>
        {toast.mensaje && <p className="toast-modal-subtitle">{toast.mensaje}</p>}
        <button className="toast-modal-close-btn" onClick={closeToast} style={{ background: config.btnBg, boxShadow: config.btnShadow }}>Aceptar</button>
        <div className="toast-modal-progress" style={{ background: config.progressBg }} />
      </div>
    </div>
  )
}

export default Toast
