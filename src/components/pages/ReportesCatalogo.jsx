import React, { useState } from 'react'
import {
  Search,
  FileText,
  TrendingUp,
  DownloadCloud,
  AlertCircle
} from 'lucide-react'
import './ReportesCatalogo.css'

const ReportesCatalogo = () => {
  // Mock data for researchers catalogue
  const catalogList = [
    { id: 1, title: 'Tonada de San Sebastián (Partitura)', author: 'Juan R. Castañeda', technique: 'Música Tradicional', date: '14/05/2026' },
    { id: 2, title: 'Cuatro de Cedro Tallado', author: 'Eleazar Rojas', technique: 'Luthiería', date: '18/05/2026' },
    { id: 3, title: 'Vasija de Barro Cocido', author: 'María Sosa', technique: 'Cerámica', date: '22/05/2026' },
    { id: 4, title: 'Traje de Danza Sanjuanero', author: 'Isabel de Rivera', technique: 'Costura Tradicional', date: '01/06/2026' },
    { id: 5, title: 'Maracas de Capacho Tradicionales', author: 'Eleazar Rojas', technique: 'Artesanía Instrumentos', date: '03/06/2026' }
  ]

  // States
  const [catalogQuery, setCatalogQuery] = useState('')
  const [isDownloading, setIsDownloading] = useState({
    pdf: false,
    excel: false,
    logs: false,
    consolidated: false
  })
  const [notificationMsg, setNotificationMsg] = useState('')

  // Filter catalog list
  const filteredCatalog = catalogList.filter(item => 
    item.title.toLowerCase().includes(catalogQuery.toLowerCase()) ||
    item.author.toLowerCase().includes(catalogQuery.toLowerCase()) ||
    item.technique.toLowerCase().includes(catalogQuery.toLowerCase())
  )

  // Simulation handler for file downloads
  const handleExportFile = (format, label) => {
    // Prevent double clicking
    if (isDownloading[format]) return

    setIsDownloading(prev => ({ ...prev, [format]: true }))
    setNotificationMsg('')

    // Simulate export latency
    setTimeout(() => {
      setIsDownloading(prev => ({ ...prev, [format]: false }))
      setNotificationMsg(`¡Descarga iniciada! Se ha generado el archivo "${label}" correctamente.`)
    }, 1200)
  }

  return (
    <div className="reportes-module-container">
      {/* 1. Cabecera de la Sección */}
      <header className="page-header">
        <div className="breadcrumbs-title">
          <nav className="breadcrumbs">
            <span>ARCHIVO</span>
            <span className="separator">&gt;</span>
            <span className="current">REPORTES Y CATÁLOGO</span>
          </nav>
          <h1>Reportes y Catálogo Digital</h1>
          <p className="cultor-subinfo text-light" style={{ fontSize: '14px', marginTop: '4px' }}>
            Análisis estadístico del patrimonio y exportación de catálogos para investigadores.
          </p>
        </div>
      </header>

      {/* 2. Panel de Indicadores (KPIs) */}
      <section className="kpis-grid">
        {/* KPI 1 */}
        <div className="kpi-card kpi-cultores">
          <span className="kpi-label">Total Cultores Registrados</span>
          <div className="kpi-value-row">
            <span className="kpi-value">124</span>
            <span className="kpi-trend-badge positive">
              <TrendingUp size={12} />
              <span>+12%</span>
            </span>
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>+14 nuevos ingresos este mes</span>
        </div>

        {/* KPI 2 */}
        <div className="kpi-card kpi-inventario">
          <span className="kpi-label">Piezas en Inventario</span>
          <div className="kpi-value-row">
            <span className="kpi-value">386</span>
            <span className="kpi-trend-badge positive">
              <TrendingUp size={12} />
              <span>+8%</span>
            </span>
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>28 piezas catalogadas recientemente</span>
        </div>

        {/* KPI 3 */}
        <div className="kpi-card kpi-consultas">
          <span className="kpi-label">Consultas del Catálogo (Mes)</span>
          <div className="kpi-value-row">
            <span className="kpi-value">1,240</span>
            <span className="kpi-trend-badge neutral">
              <span>=</span>
            </span>
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>14 investigadores autorizados activos</span>
        </div>
      </section>

      {/* 3. Sección de Gráficos de Análisis (Simulados) */}
      <section className="charts-grid">
        {/* Left Chart: Patrimonio por Municipio */}
        <div className="chart-card">
          <h3>Patrimonio por Municipio</h3>
          <div className="municipio-bars-container">
            <div className="municipio-bar-item">
              <div className="municipio-bar-label-row">
                <span>San Cristóbal</span>
                <span>42%</span>
              </div>
              <div className="municipio-bar-track">
                <div className="municipio-bar-fill" style={{ width: '42%', backgroundColor: '#C05640' }}></div>
              </div>
            </div>

            <div className="municipio-bar-item">
              <div className="municipio-bar-label-row">
                <span>Lobatera</span>
                <span>28%</span>
              </div>
              <div className="municipio-bar-track">
                <div className="municipio-bar-fill" style={{ width: '28%', backgroundColor: '#f59e0b' }}></div>
              </div>
            </div>

            <div className="municipio-bar-item">
              <div className="municipio-bar-label-row">
                <span>Capacho</span>
                <span>18%</span>
              </div>
              <div className="municipio-bar-track">
                <div className="municipio-bar-fill" style={{ width: '18%', backgroundColor: '#d97706' }}></div>
              </div>
            </div>

            <div className="municipio-bar-item">
              <div className="municipio-bar-label-row">
                <span>Otros Municipios</span>
                <span>12%</span>
              </div>
              <div className="municipio-bar-track">
                <div className="municipio-bar-fill" style={{ width: '12%', backgroundColor: '#807471' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Chart: Growth Line Chart via Inline SVG */}
        <div className="chart-card">
          <h3>Tendencia de Crecimiento del Inventario (2026)</h3>
          <div className="svg-chart-container">
            <svg viewBox="0 0 400 180">
              {/* Grid Lines */}
              <line x1="40" y1="30" x2="380" y2="30" className="svg-grid-line" />
              <line x1="40" y1="75" x2="380" y2="75" className="svg-grid-line" />
              <line x1="40" y1="120" x2="380" y2="120" className="svg-grid-line" />
              <line x1="40" y1="150" x2="380" y2="150" className="svg-grid-line" style={{ strokeDasharray: 'none', stroke: '#ebeae6' }} />

              {/* Y Axis labels */}
              <text x="15" y="34" className="svg-axis-text">400</text>
              <text x="15" y="79" className="svg-axis-text">200</text>
              <text x="15" y="124" className="svg-axis-text">100</text>
              <text x="25" y="154" className="svg-axis-text">0</text>

              {/* Chart Line Path */}
              <path d="M 40 142 L 100 135 L 160 110 L 220 90 L 280 62 L 340 40" className="svg-chart-line" />

              {/* Chart Dots */}
              <circle cx="40" cy="142" r="4" className="svg-chart-dot" title="Ene: 60" />
              <circle cx="100" cy="135" r="4" className="svg-chart-dot" title="Feb: 75" />
              <circle cx="160" cy="110" r="4" className="svg-chart-dot" title="Mar: 124" />
              <circle cx="220" cy="90" r="4" className="svg-chart-dot" title="Abr: 168" />
              <circle cx="280" cy="62" r="4" className="svg-chart-dot" title="May: 250" />
              <circle cx="340" cy="40" r="4" className="svg-chart-dot" title="Jun: 386" />

              {/* X Axis Labels */}
              <text x="32" y="170" className="svg-axis-text">Ene</text>
              <text x="92" y="170" className="svg-axis-text">Feb</text>
              <text x="152" y="170" className="svg-axis-text">Mar</text>
              <text x="212" y="170" className="svg-axis-text">Abr</text>
              <text x="272" y="170" className="svg-axis-text">May</text>
              <text x="332" y="170" className="svg-axis-text">Jun</text>
            </svg>
          </div>
        </div>
      </section>

      {/* 4. Módulo de Exportación y Catálogo */}
      <section className="export-catalog-card">
        {/* Left Column: Technical Reports */}
        <div className="export-column">
          <div>
            <h3>Exportación de Reportes Técnicos</h3>
            <p>Descarga informes consolidados formateados para revisiones gubernamentales, auditorías y memoria académica.</p>
          </div>

          <div className="export-buttons-stack">
            <button 
              className="btn-export-pdf"
              disabled={isDownloading.pdf}
              onClick={() => handleExportFile('pdf', 'reporte_patrimonio_auditoria.pdf')}
            >
              <FileText size={18} />
              <span>{isDownloading.pdf ? 'Generando PDF...' : 'Descargar Reporte en PDF'}</span>
            </button>

            <button 
              className="btn-export-excel"
              disabled={isDownloading.excel}
              onClick={() => handleExportFile('excel', 'inventario_patrimonio_completo.xlsx')}
            >
              <FileText size={18} />
              <span>{isDownloading.excel ? 'Generando Excel...' : 'Descargar Excel de Inventario'}</span>
            </button>

            <button 
              className="btn-export-logs"
              disabled={isDownloading.logs}
              onClick={() => handleExportFile('logs', 'logs_acciones_inventario.log')}
            >
              <FileText size={18} />
              <span>{isDownloading.logs ? 'Exportando Logs...' : 'Exportar Auditoría de Logs'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Searchable Catalog */}
        <div className="catalog-column">
          <div>
            <h3>Catálogo Digital e Investigadores</h3>
            <p>Filtrar y exportar fichas técnicas estructuradas específicas para citaciones en proyectos de investigación y difusión.</p>
          </div>

          {/* Search bar inside catalog */}
          <div className="catalog-search-wrapper">
            <Search className="search-input-icon" size={16} style={{ color: 'var(--text-secondary)', marginRight: '8px' }} />
            <input 
              type="text" 
              placeholder="Filtrar catálogo para exportación (Ej. Vasija, Cera...)" 
              value={catalogQuery}
              onChange={(e) => setCatalogQuery(e.target.value)}
            />
          </div>

          {/* Simple Table list */}
          <div className="catalog-table-wrapper">
            <table className="simple-table">
              <thead>
                <tr>
                  <th>TÍTULO</th>
                  <th>CULTOR</th>
                  <th>TÉCNICA</th>
                  <th className="text-right">ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {filteredCatalog.length > 0 ? (
                  filteredCatalog.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '700' }}>{item.title}</span>
                          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{item.date}</span>
                        </div>
                      </td>
                      <td>{item.author}</td>
                      <td>{item.technique}</td>
                      <td className="text-right">
                        <button 
                          className="btn-export-inline"
                          onClick={() => handleExportFile('pdf', `ficha_${item.id}_${item.title.toLowerCase().replace(/ /g, '_')}.pdf`)}
                        >
                          Exportar Ficha
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '16px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      No se encontraron coincidencias en el catálogo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Notification Banner */}
      {notificationMsg && (
        <div className="success-banner-alert" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{notificationMsg}</span>
          </div>
          <button onClick={() => setNotificationMsg('')} style={{ color: 'inherit', fontWeight: '700', border: 'none', background: 'none', textDecoration: 'underline', cursor: 'pointer' }}>Cerrar</button>
        </div>
      )}

      {/* 5. Botón de Acción Principal */}
      <footer className="consolidated-action-container">
        <button 
          className="btn-consolidated-pdf"
          disabled={isDownloading.consolidated}
          onClick={() => handleExportFile('consolidated', 'catalogo_consolidado_archivo_completo.pdf')}
        >
          <DownloadCloud size={18} />
          <span>
            {isDownloading.consolidated 
              ? 'Consolidando Catálogo Completo (PDF)...' 
              : 'Generar Catálogo Consolidado del Archivo (PDF Completo)'
            }
          </span>
        </button>
      </footer>
    </div>
  )
}

export default ReportesCatalogo
