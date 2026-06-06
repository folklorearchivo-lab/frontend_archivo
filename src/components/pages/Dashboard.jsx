import React from 'react'
import {
  Download,
  ChevronDown,
  BookOpen,
  MapPin,
  Users,
  HardDrive
} from 'lucide-react'
import './Dashboard.css'
import partituraImg from '../../assets/featured_partitura.png'

const Dashboard = () => {
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

      {/* Stats Grid */}
      <section className="stats-grid" aria-label="Estadísticas rápidas">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">CULTORES REGISTRADOS</span>
            <div className="stat-icon-wrapper orange">
              <Users size={16} />
            </div>
          </div>
          <div className="stat-value-container">
            <span className="stat-value">2,481</span>
            <span className="stat-percentage positive">+12%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">OBRAS CATALOGADAS</span>
            <div className="stat-icon-wrapper grey">
              <BookOpen size={16} />
            </div>
          </div>
          <div className="stat-value-container">
            <span className="stat-value">15,902</span>
            <span className="stat-percentage neutral">Total</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">TERRITORIO CUBIERTO</span>
            <div className="stat-icon-wrapper light-orange">
              <MapPin size={16} />
            </div>
          </div>
          <div className="stat-value-container">
            <span className="stat-value">100%</span>
            <span className="stat-subtext">29 MUNICIPIOS</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">VOLUMEN DIGITAL</span>
            <div className="stat-icon-wrapper info">
              <HardDrive size={16} />
            </div>
          </div>
          <div className="stat-value-container">
            <span className="stat-value">42.5 TB</span>
            <span className="stat-subtext text-yellow">72% LLENO</span>
          </div>
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
                {/* Musica */}
                <div className="chart-bar-col">
                  <div className="bar-track">
                    <div className="bar-fill" style={{ height: '75%' }}></div>
                  </div>
                  <span className="bar-label">MÚSICA</span>
                </div>

                {/* Danza */}
                <div className="chart-bar-col">
                  <div className="bar-track">
                    <div className="bar-fill" style={{ height: '45%' }}></div>
                  </div>
                  <span className="bar-label">DANZA</span>
                </div>

                {/* Artesania */}
                <div className="chart-bar-col">
                  <div className="bar-track">
                    <div className="bar-fill" style={{ height: '30%' }}></div>
                  </div>
                  <span className="bar-label">ARTESANÍA</span>
                </div>

                {/* Oralidad */}
                <div className="chart-bar-col">
                  <div className="bar-track">
                    <div className="bar-fill" style={{ height: '60%' }}></div>
                  </div>
                  <span className="bar-label">ORALIDAD</span>
                </div>

                {/* Gastronomia */}
                <div className="chart-bar-col">
                  <div className="bar-track">
                    <div className="bar-fill" style={{ height: '25%' }}></div>
                  </div>
                  <span className="bar-label">GASTRONOMÍA</span>
                </div>

                {/* Teatro */}
                <div className="chart-bar-col">
                  <div className="bar-track">
                    <div className="bar-fill" style={{ height: '80%' }}></div>
                  </div>
                  <span className="bar-label">TEATRO</span>
                </div>
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
                  <tr>
                    <td>
                      <div className="table-cell-profile">
                        <div className="cell-initials bg-dark">JR</div>
                        <span className="cell-name">Juan R. Castañeda</span>
                      </div>
                    </td>
                    <td>San Cristóbal</td>
                    <td className="text-light">Hoy, 10:45</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="table-cell-profile">
                        <div className="cell-initials bg-orange">MS</div>
                        <span className="cell-name">María Sosa - "El Rezo"</span>
                      </div>
                    </td>
                    <td>Lobatera</td>
                    <td className="text-light">Ayer, 16:20</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Efemérides Card */}
          <div className="card widget-card">
            <h3>Efemérides</h3>
            <div className="events-list">
              <div className="event-item">
                <span className="event-date">24 de Mayo</span>
                <p className="event-desc">Día Nacional del Patrimonio</p>
              </div>
              <div className="event-item">
                <span className="event-date">28 de Mayo</span>
                <p className="event-desc">Natalicio de Ramón y Rivera</p>
              </div>
            </div>
          </div>

          {/* Estado del Sistema Card */}
          <div className="card status-card">
            <h3>Estado del Sistema</h3>
            <div className="storage-metric">
              <div className="storage-header">
                <span className="storage-label">ALMACENAMIENTO</span>
                <span className="storage-pct">72%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: '72%' }}></div>
              </div>
            </div>
            <button className="btn-diagnostico">Ver Diagnóstico</button>
          </div>

          {/* Pieza Destacada Card */}
          <div className="card featured-card">
            <div className="featured-image-wrapper">
              <img src={partituraImg} alt="Partituras Inéditas de 1947" className="featured-img" />
            </div>
            <div className="featured-content">
              <span className="featured-subtitle">PIEZA DESTACADA</span>
              <h4 className="featured-title">Partituras Inéditas de 1947</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
