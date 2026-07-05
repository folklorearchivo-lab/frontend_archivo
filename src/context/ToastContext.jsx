import { createContext, useContext, useState, useCallback, useRef } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  const showToast = useCallback(({ titulo, mensaje, tipo = 'success' }) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({ titulo, mensaje, tipo })
    timerRef.current = setTimeout(() => setToast(null), 4000)
  }, [])

  const closeToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast(null)
  }, [])

  return (
    <ToastContext.Provider value={{ toast, showToast, closeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de un ToastProvider')
  return ctx
}

export default ToastContext
