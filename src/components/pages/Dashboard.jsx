import React, { useEffect, useState } from 'react'
import {
  Download,
  ChevronDown,
  BookOpen,
  MapPin,
  Users
} from 'lucide-react'
import './Dashboard.css'
import { getDashboardResumenRequest } from '../../services/api'

const AVATAR_BG_CLASSES = ['bg-dark', 'bg-orange']

const CHART_COLORS = ['#C05640', '#b1791f', '#8a5a3c', '#7a8454', '#a8493f', '#c9a227']

function obtenerIniciales(nombreCompleto) {
  if (!nombreCompleto) return '--'
  const partes = nombreCompleto.trim().split(/\s+/)
  const iniciales = partes.slice(0, 2).map((parte) => parte[0]?.toUpperCase() || '')
  return iniciales.join('') || '--'
}

function formatearFecha(fechaISO) {
  if (!fechaISO) return 'Sin fecha'
  const fecha = new Date(fechaISO)
  const ahora = new Date()
  const hora = fecha.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })

  const esMismoDia = fecha.toDateString() === ahora.toDateString()
  if (esMismoDia) return `Hoy, ${hora}`

  const ayer = new Date(ahora)
  ayer.setDate(ahora.getDate() - 1)
  if (fecha.toDateString() === ayer.toDateString()) return `Ayer, ${hora}`

  return `${fecha.toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit' })}, ${hora}`
}

const Dashboard = () => {
  const [resumen, setResumen] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('auth-token')
      const data = await getDashboardResumenRequest(token)
      setResumen(data)
    } catch (err) {
      console.error('Error al cargar el resumen del dashboard:', err)
      setError(err.message || 'No se pudo cargar el resumen del dashboard.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      {/* Breadcrumbs and Actions */}
      <div className="page-header">
        <div className="breadcrumbs-title">
          <nav className="breadcrumbs">
            <span>ARCHIVO</span>
            <span className="separator">&gt;</span>
            <span className="current">DASHBOARD</span>
          </nav>
          <h1>Resumen Estadístico Consolidado</h1>
        </div>

        <div className="header-actions">
          <button className="btn-secondary">
            <Download size={16} />
            <span>Exportar Reporte</span>
          </button>
        </div>
      </div>

      {isLoading && <p>Cargando...</p>}
      {!isLoading && error && <p>{error}</p>}

      {!isLoading && !error && resumen && (
        <>
          {/* Stats Grid */}
          <section className="stats-grid" aria-label="Estadísticas rápidas">
            <div className="stat-card orange">
              <div className="stat-card-header">
                <div className="stat-icon-wrapper">
                  <Users size={22} />
                </div>
                <span className="stat-label">CULTORES REGISTRADOS</span>
              </div>
              <span className="stat-value">{resumen.cultores.total.toLocaleString('es-VE')}</span>
            </div>

            <div className="stat-card gold">
              <div className="stat-card-header">
                <div className="stat-icon-wrapper">
                  <BookOpen size={22} />
                </div>
                <span className="stat-label">OBRAS CATALOGADAS</span>
              </div>
              <span className="stat-value">{resumen.obras.total.toLocaleString('es-VE')}</span>
            </div>

            <div className="stat-card clay">
              <div className="stat-card-header">
                <div className="stat-icon-wrapper">
                  <MapPin size={22} />
                </div>
                <span className="stat-label">MUNICIPIOS CON COBERTURA</span>
              </div>
              <span className="stat-value">
                {resumen.territorio.municipiosCubiertos}/{resumen.territorio.totalMunicipios}
              </span>
            </div>
          </section>

          {/* Main Visual Section */}
          <div className="main-layout-grid">
            {/* Left Column */}
            <div className="left-column">
              {/* Chart Card */}
              <div className="card chart-card">
                <div className="chart-header">
                  <h3>Distribución por Disciplina Artística</h3>
                  <button className="dropdown-selector">
                    <span>Este Año</span>
                    <ChevronDown size={14} />
                  </button>
                </div>

                <div className="chart-body">
                  <div className="bar-chart">
                    {resumen.distribucionCategorias.length === 0 && (
                      <p>Aún no hay obras catalogadas.</p>
                    )}
                    {resumen.distribucionCategorias.map((categoria, index) => {
                      const color = CHART_COLORS[index % CHART_COLORS.length]
                      return (
                        <div className="chart-bar-col" key={categoria.nombre}>
                          <span className="bar-count" style={{ color }}>{categoria.cantidad}</span>
                          <div className="bar-track">
                            <div
                              className="bar-fill"
                              style={{
                                height: `${Math.max(categoria.porcentaje, categoria.cantidad > 0 ? 6 : 2)}%`,
                                backgroundColor: color,
                              }}
                            ></div>
                          </div>
                          <span className="bar-label">{categoria.nombre.toUpperCase()}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Table Card */}
              <div className="card table-card">
                <div className="table-header">
                  <h3>Recientes Incorporaciones</h3>
                  <a href="#catalogo" className="view-all-link">
                    Ver catálogo completo
                  </a>
                </div>

                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>CULTOR / OBRA</th>
                        <th>REGIÓN</th>
                        <th>FECHA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resumen.recientes.length === 0 && (
                        <tr>
                          <td colSpan={3}>Aún no hay incorporaciones registradas.</td>
                        </tr>
                      )}
                      {resumen.recientes.map((item, index) => (
                        <tr key={item.id_obra}>
                          <td>
                            <div className="table-cell-profile">
                              <div className={`cell-initials ${AVATAR_BG_CLASSES[index % AVATAR_BG_CLASSES.length]}`}>
                                {obtenerIniciales(item.cultorNombre)}
                              </div>
                              <span className="cell-name">
                                {item.cultorNombre ? `${item.cultorNombre} - "${item.titulo}"` : item.titulo}
                              </span>
                            </div>
                          </td>
                          <td>{item.region || 'Sin región'}</td>
                          <td className="text-light">{formatearFecha(item.fecha)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="right-column">
              {/* Pieza Destacada Card */}
              {resumen.piezaDestacada && (
                <div className="card featured-card">
                  {resumen.piezaDestacada.imagenUrl && (
                    <div className="featured-image-wrapper">
                      <img
                        src={resumen.piezaDestacada.imagenUrl}
                        alt={resumen.piezaDestacada.titulo}
                        className="featured-img"
                      />
                    </div>
                  )}
                  <div className="featured-content">
                    <span className="featured-subtitle">PIEZA DESTACADA</span>
                    <h4 className="featured-title">{resumen.piezaDestacada.titulo}</h4>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Dashboard
