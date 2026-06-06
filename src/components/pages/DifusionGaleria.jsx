import React, { useState } from 'react'
import {
  Search,
  Plus,
  X,
  Edit2,
  Trash2,
  QrCode,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Laptop,
  UploadCloud,
  FileText,
  Image as ImageIcon
} from 'lucide-react'
import partituraImg from '../../assets/featured_partitura.png'
import './DifusionGaleria.css'

const DifusionGaleria = () => {
  // Mock data of exhibitions
  const [exhibitions, setExhibitions] = useState([
    {
      id: 1,
      title: 'Talla y Madera del Táchira',
      dates: '15 Jun - 30 Jun',
      published: true,
      image: partituraImg
    },
    {
      id: 2,
      title: 'Instrumentos de Viento y Cuerdas tradicionales',
      dates: '01 Jul - 15 Jul',
      published: false,
      image: null
    },
    {
      id: 3,
      title: 'Vestimentas Típicas de Capacho',
      dates: '20 Jul - 05 Ago',
      published: true,
      image: null
    }
  ])

  // Mock pieces for QR mass action
  const qrPiecesList = [
    { id: 10, name: 'Partitura Original: Tonada de San Sebastián', code: 'IP-001' },
    { id: 11, name: 'Cuatro de Cedro Tallado', code: 'IP-002' },
    { id: 12, name: 'Traje de Danza de Sanjuanero', code: 'IP-003' },
    { id: 13, name: 'Vasija de Barro Cocido', code: 'IP-004' },
    { id: 14, name: 'Maracas de Capacho Tradicionales', code: 'IP-005' }
  ]

  // States
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Efemérides State
  const [efemerideText, setEfemerideText] = useState(
    'Mes del Folklore Tachirense: Conoce los rostros y saberes que tallan la identidad de nuestra región a través de nuestras expresiones vivas.'
  )
  const [efemerideBg, setEfemerideBg] = useState(null)

  // QR Selection State
  const [qrSearchQuery, setQrSearchQuery] = useState('')
  const [selectedQrPieces, setSelectedQrPieces] = useState([])
  const [isPdfGenerating, setIsPdfGenerating] = useState(false)
  const [pdfNotification, setPdfNotification] = useState('')

  // Exhibition Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create' | 'edit'
  const [editingExhibitionId, setEditingExhibitionId] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newDates, setNewDates] = useState('')
  const [newPublished, setNewPublished] = useState(true)
  const [newImage, setNewImage] = useState(null)
  const [formError, setFormError] = useState('')

  // Public Simulator State
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)

  // Single QR Popup State
  const [isQrPopupOpen, setIsQrPopupOpen] = useState(false)
  const [selectedQrForView, setSelectedQrForView] = useState(null)

  // Toggle switch handler
  const handleTogglePublished = (id) => {
    setExhibitions(prev => prev.map(ex => 
      ex.id === id ? { ...ex, published: !ex.published } : ex
    ))
  }

  // Open Create Exhibition Modal
  const handleOpenCreateModal = () => {
    setModalMode('create')
    setEditingExhibitionId(null)
    setNewTitle('')
    setNewDates('')
    setNewPublished(true)
    setNewImage(null)
    setFormError('')
    setIsModalOpen(true)
  }

  // Open Edit Exhibition Modal
  const handleOpenEditModal = (ex) => {
    setModalMode('edit')
    setEditingExhibitionId(ex.id)
    setNewTitle(ex.title)
    setNewDates(ex.dates)
    setNewPublished(ex.published)
    setNewImage(ex.image)
    setFormError('')
    setIsModalOpen(true)
  }

  // Handle Base64 Image upload for exhibitions and efemérides
  const handleImageChange = (e, target) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        if (target === 'exhibition') setNewImage(reader.result)
        else if (target === 'efemeride') setEfemerideBg(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Form Submit (Create/Edit)
  const handleRegisterExhibition = (e) => {
    e.preventDefault()

    if (!newTitle.trim() || !newDates.trim()) {
      setFormError('Por favor completa los campos obligatorios: Título y Fechas.')
      return
    }

    if (modalMode === 'create') {
      const newEx = {
        id: Date.now(),
        title: newTitle.trim(),
        dates: newDates.trim(),
        published: newPublished,
        image: newImage
      }
      setExhibitions([...exhibitions, newEx])
    } else {
      setExhibitions(prev => prev.map(ex => 
        ex.id === editingExhibitionId 
          ? { 
              ...ex, 
              title: newTitle.trim(), 
              dates: newDates.trim(), 
              published: newPublished, 
              image: newImage 
            } 
          : ex
      ))
    }

    setNewTitle('')
    setNewDates('')
    setNewPublished(true)
    setNewImage(null)
    setEditingExhibitionId(null)
    setFormError('')
    setIsModalOpen(false)
  }

  // Delete Exhibition
  const handleDeleteExhibition = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta exposición?')) {
      setExhibitions(exhibitions.filter(ex => ex.id !== id))
    }
  }

  // Toggle QR checklist items
  const handleToggleQrSelect = (id) => {
    if (selectedQrPieces.includes(id)) {
      setSelectedQrPieces(selectedQrPieces.filter(i => i !== id))
    } else {
      setSelectedQrPieces([...selectedQrPieces, id])
    }
  }

  // QR Checklist search filter
  const filteredQrPieces = qrPiecesList.filter(piece => 
    piece.name.toLowerCase().includes(qrSearchQuery.toLowerCase()) ||
    piece.code.toLowerCase().includes(qrSearchQuery.toLowerCase())
  )

  // Simulate QR PDF download
  const handleDownloadQrPdf = () => {
    if (selectedQrPieces.length === 0) return
    setIsPdfGenerating(true)
    setPdfNotification('')

    setTimeout(() => {
      setIsPdfGenerating(false)
      setPdfNotification(
        `¡Paquete PDF generado con éxito! Se han descargado ${selectedQrPieces.length} códigos QR del inventario seleccionado.`
      )
    }, 1500)
  }

  return (
    <div className="difusion-module-container">
      {/* 1. Cabecera de la Sección */}
      <header className="page-header">
        <div className="breadcrumbs-title">
          <nav className="breadcrumbs">
            <span>ARCHIVO</span>
            <span className="separator">&gt;</span>
            <span className="current">DIFUSIÓN Y GALERÍA</span>
          </nav>
          <h1>Difusión y Galería Virtual</h1>
          <p className="cultor-subinfo text-light" style={{ fontSize: '14px', marginTop: '4px' }}>
            Configuración de exposiciones, visibilidad pública y gestión de códigos QR.
          </p>
        </div>

        <div className="page-header-actions">
          <button className="btn-terracota-outline" onClick={() => setIsSimulatorOpen(true)}>
            <Laptop size={16} />
            <span>Previsualizar Galería</span>
          </button>
          <button className="btn-terracota" onClick={handleOpenCreateModal}>
            <Plus size={16} />
            <span>Nueva Exposición</span>
          </button>
        </div>
      </header>

      {/* 2. Sección de Efemérides / Destacados */}
      <section className="efemerides-editor-section">
        <h2 className="section-card-title">
          <ImageIcon size={18} style={{ color: '#C05640' }} />
          <span>Configuración del Banner de Efemérides Patrimoniales</span>
        </h2>
        <div className="efemerides-banner-editor">
          <div className="efemerides-form-group">
            <label htmlFor="efemeride-text">Texto Destacado de la Efeméride</label>
            <textarea 
              id="efemeride-text"
              className="efemerides-textarea"
              placeholder="Escribe el mensaje destacado..."
              value={efemerideText}
              onChange={(e) => setEfemerideText(e.target.value)}
            />
          </div>

          <div className="efemerides-bg-uploader">
            <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Imagen de Fondo</span>
            {efemerideBg ? (
              <div className="image-form-preview" style={{ marginTop: '4px' }}>
                <img src={efemerideBg} alt="Fondo efeméride" style={{ width: '60px', height: '60px' }} />
                <button 
                  type="button" 
                  className="remove-img-form-btn"
                  onClick={() => setEfemerideBg(null)}
                >
                  Quitar
                </button>
              </div>
            ) : (
              <button 
                type="button" 
                className="btn-terracota-outline" 
                style={{ padding: '8px 12px', fontSize: '12px' }}
                onClick={() => document.getElementById('efemeride-bg-picker').click()}
              >
                <UploadCloud size={14} />
                <span>Subir Imagen</span>
                <input 
                  type="file" 
                  id="efemeride-bg-picker" 
                  accept="image/*" 
                  style={{ display: 'none' }}
                  onChange={(e) => handleImageChange(e, 'efemeride')}
                />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. Tablero de Exposiciones (Exhibition Cards Board) */}
      <section>
        <h2 className="section-card-title" style={{ marginBottom: '16px' }}>
          <span>Exposiciones y Muestras Activas</span>
        </h2>

        <div className="exhibitions-grid">
          {exhibitions.map(ex => (
            <div className="exhibition-card" key={ex.id}>
              {ex.image ? (
                <img src={ex.image} alt={ex.title} className="exhibition-card-img" />
              ) : (
                <div className="exhibition-card-no-img">
                  <ImageIcon size={32} />
                  <span style={{ fontSize: '12px', fontWeight: '600' }}>Sin imagen de fondo</span>
                </div>
              )}

              <div className="exhibition-card-body">
                <h3>{ex.title}</h3>
                <div className="exhibition-date-row">
                  <Calendar size={14} />
                  <span>{ex.dates}</span>
                </div>

                <div className="exhibition-status-row">
                  <span className={`status-text-pill ${ex.published ? 'publicado' : 'borrador'}`}>
                    {ex.published ? 'Publicado' : 'Borrador'}
                  </span>
                  
                  {/* CSS Toggle switch */}
                  <label className="toggle-switch-wrapper">
                    <input 
                      type="checkbox" 
                      checked={ex.published}
                      onChange={() => handleTogglePublished(ex.id)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              {/* Card Footer Quick Actions */}
              <div className="exhibition-card-footer">
                <button 
                  className="exhibition-action-btn" 
                  title="Mostrar Código QR"
                  onClick={() => {
                    setSelectedQrForView(ex)
                    setIsQrPopupOpen(true)
                  }}
                >
                  <QrCode size={15} />
                </button>
                <button 
                  className="exhibition-action-btn" 
                  title="Editar Exposición"
                  onClick={() => handleOpenEditModal(ex)}
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  className="exhibition-action-btn delete-btn" 
                  title="Eliminar Exposición"
                  onClick={() => handleDeleteExhibition(ex.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Sección de Control de QR (Acción masiva) */}
      <section className="mass-qr-selector-box">
        <h2 className="section-card-title" style={{ margin: '0' }}>
          <QrCode size={18} style={{ color: '#C05640' }} />
          <span>Generación y Descarga Masiva de Códigos QR</span>
        </h2>

        {/* Toolbar selectors */}
        <div className="qr-selector-toolbar">
          <div className="search-input-wrapper" style={{ width: '280px' }}>
            <Search className="search-input-icon" size={16} />
            <input 
              type="text" 
              placeholder="Buscar piezas para QR..." 
              value={qrSearchQuery}
              onChange={(e) => setQrSearchQuery(e.target.value)}
            />
            {qrSearchQuery && (
              <button 
                onClick={() => setQrSearchQuery('')}
                className="clear-search-icon-btn"
                aria-label="Limpiar búsqueda"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              {selectedQrPieces.length} seleccionados
            </span>
            <button 
              className="qr-download-btn"
              disabled={selectedQrPieces.length === 0 || isPdfGenerating}
              onClick={handleDownloadQrPdf}
            >
              {isPdfGenerating ? 'Generando PDF...' : 'Descargar paquete de QR (PDF)'}
            </button>
          </div>
        </div>

        {/* Checkbox Grid */}
        <div className="qr-checklist-scroll">
          {filteredQrPieces.length > 0 ? (
            filteredQrPieces.map(piece => (
              <label className="qr-checkbox-item" key={piece.id}>
                <input 
                  type="checkbox" 
                  checked={selectedQrPieces.includes(piece.id)}
                  onChange={() => handleToggleQrSelect(piece.id)}
                />
                <span>{piece.name}</span>
                <span className="piece-code-lbl">{piece.code}</span>
              </label>
            ))
          ) : (
            <p style={{ gridColumn: '1/-1', margin: '12px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
              No se encontraron piezas en el inventario.
            </p>
          )}
        </div>

        {/* Notification Banner */}
        {pdfNotification && (
          <div className="success-banner-alert">
            <span>{pdfNotification}</span>
            <button onClick={() => setPdfNotification('')}>Cerrar</button>
          </div>
        )}
      </section>

      {/* 5. Registrar / Editar Exposición Modal Overlay */}
      {isModalOpen && (
        <div className="modal-overlay-backdrop">
          <div className="modal-box-card">
            {/* Header */}
            <div className="modal-box-header">
              <h2>{modalMode === 'create' ? 'Crear Nueva Exposición' : 'Editar Exposición'}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="close-x-btn"
                aria-label="Cerrar modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleRegisterExhibition}>
              <div className="modal-box-body">
                {formError && (
                  <div className="error-banner-group">
                    {formError}
                  </div>
                )}

                {/* Title */}
                <div className="input-box-field">
                  <label htmlFor="modal-exhibition-title">Título de la Exposición <span className="req-star">*</span></label>
                  <div className="icon-input-container">
                    <ImageIcon size={15} className="field-icon-left" />
                    <input 
                      type="text" 
                      id="modal-exhibition-title" 
                      placeholder="Ej. Talla y Madera del Táchira"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="input-box-field">
                  <label htmlFor="modal-exhibition-dates">Rango de Fechas (Exposición) <span className="req-star">*</span></label>
                  <div className="icon-input-container">
                    <Calendar size={15} className="field-icon-left" />
                    <input 
                      type="text" 
                      id="modal-exhibition-dates" 
                      placeholder="Ej. 15 Jun - 30 Jun"
                      value={newDates}
                      onChange={(e) => setNewDates(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Image Picker */}
                <div className="input-box-field">
                  <label>Imagen Destacada de la Temática</label>
                  <div className="image-upload-row">
                    {newImage ? (
                      <div className="image-form-preview">
                        <img src={newImage} alt="Exhibition Preview" style={{ width: '74px', height: '74px' }} />
                        <button 
                          type="button" 
                          className="remove-img-form-btn"
                          onClick={() => setNewImage(null)}
                        >
                          Quitar Foto
                        </button>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        className="btn-terracota-outline"
                        onClick={() => document.getElementById('exhibition-image-file').click()}
                      >
                        <UploadCloud size={16} />
                        <span>Subir Imagen</span>
                        <input 
                          type="file" 
                          id="exhibition-image-file" 
                          accept="image/*" 
                          style={{ display: 'none' }}
                          onChange={(e) => handleImageChange(e, 'exhibition')}
                        />
                      </button>
                    )}
                  </div>
                </div>

                {/* Switch default status */}
                <div className="input-box-field" style={{ flexDirection: 'row', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                  <label style={{ margin: '0' }}>Publicar inmediatamente</label>
                  <label className="toggle-switch-wrapper">
                    <input 
                      type="checkbox" 
                      checked={newPublished}
                      onChange={(e) => setNewPublished(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-box-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-terracota">
                  {modalMode === 'create' ? 'Crear Exposición' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Simulador de Galería Pública Modal Overlay */}
      {isSimulatorOpen && (
        <div className="public-simulator-overlay">
          <div className="public-simulator-box">
            {/* Header */}
            <div className="public-simulator-header">
              <h2>
                <Eye size={18} />
                <span>Simulador de Galería Pública</span>
                <span className="simulator-tag">VISTA PORTAL PUBLICO</span>
              </h2>
              <button 
                onClick={() => setIsSimulatorOpen(false)}
                className="close-x-btn"
                style={{ color: '#ffffff' }}
                aria-label="Cerrar simulador"
              >
                <X size={18} />
              </button>
            </div>

            {/* Portal Body */}
            <div className="public-simulator-body">
              {/* Public Efemérides Banner */}
              <div className="public-efemerides-banner">
                {efemerideBg && (
                  <img src={efemerideBg} alt="Banner background" className="public-efemerides-bg" />
                )}
                <div className="public-efemerides-content">
                  <h4>Efemérides Destacadas</h4>
                  <p>{efemerideText || 'Cargando efemérides del folklore...'}</p>
                </div>
              </div>

              {/* Exhibitions list */}
              <div>
                <h3 className="public-section-title">Galería de Exposiciones Virtuales</h3>
                <div className="public-exhibitions-grid">
                  {exhibitions.filter(ex => ex.published).length > 0 ? (
                    exhibitions.filter(ex => ex.published).map(ex => (
                      <div className="public-exhibition-card" key={ex.id}>
                        {ex.image ? (
                          <img src={ex.image} alt={ex.title} />
                        ) : (
                          <div style={{ height: '130px', backgroundColor: '#ebeae6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a39996' }}>
                            <ImageIcon size={28} />
                          </div>
                        )}
                        <div className="public-exhibition-card-body">
                          <h4>{ex.title}</h4>
                          <span>Periodo: {ex.dates}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '24px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      No hay exposiciones publicadas en este momento.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-box-footer" style={{ borderTop: '1px solid var(--border-color)', backgroundColor: '#faf9f6' }}>
              <button className="btn-secondary" onClick={() => setIsSimulatorOpen(false)}>
                Cerrar Previsualización
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Modal de visualización de QR individual */}
      {isQrPopupOpen && selectedQrForView && (
        <div className="modal-overlay-backdrop">
          <div className="modal-box-card" style={{ width: '360px' }}>
            <div className="modal-box-header">
              <h2>Código QR de Exposición</h2>
              <button 
                onClick={() => {
                  setIsQrPopupOpen(false)
                  setSelectedQrForView(null)
                }}
                className="close-x-btn"
                aria-label="Cerrar modal"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="modal-box-body" style={{ textAlign: 'center', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '16px', border: '2px solid #C05640', borderRadius: '12px', backgroundColor: '#faf9f6' }}>
                <QrCode size={180} style={{ color: '#2d1e1b' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0' }}>{selectedQrForView.title}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Periodo: {selectedQrForView.dates}</p>
              </div>
              <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Escanea este código para acceder a la sala pública virtual.</span>
            </div>

            <div className="modal-box-footer">
              <button 
                className="btn-terracota" 
                onClick={() => {
                  setIsQrPopupOpen(false)
                  setSelectedQrForView(null)
                }}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DifusionGaleria
