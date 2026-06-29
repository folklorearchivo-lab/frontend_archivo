import React, { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  X,
  Edit2,
  Trash2,
  Camera,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  QrCode,
  UploadCloud,
  FileText,
  FileAudio,
  FileImage,
  File,
  User,
  Paperclip
} from 'lucide-react'
import partituraImg from '../../assets/featured_partitura.png'
import './InventarioPatrimonial.css'
import { 
  getObrasAdminRequest,
  createObraRequest,
  updateObraRequest,
  deleteObraRequest,
  getCultoresAprobadosRequest,
  getCategoriasRequest,
  createCategoriaRequest,
  uploadMultimediaRequest
} from '../../services/api'

const InventarioPatrimonial = () => {
  const token = localStorage.getItem('auth-token')
  
  const [inventario, setInventario] = useState([])
  const [categoriesList, setCategoriesList] = useState([])
  const [cultoresList, setCultoresList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [customCategory, setCustomCategory] = useState('')

  const [isStandaloneCategoryModalOpen, setIsStandaloneCategoryModalOpen] = useState(false)
  const [standaloneCategoryName, setStandaloneCategoryName] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    setError('')
    try {
      const [obras, cultores, categorias] = await Promise.all([
        getObrasAdminRequest(token).catch(() => []),
        getCultoresAprobadosRequest(token).catch(() => []),
        getCategoriasRequest().catch(() => [])
      ])
      setInventario(obras)
      setCultoresList(cultores)
      setCategoriesList(categorias)
    } catch (err) {
      console.error('Error al cargar datos de inventario:', err)
      setError('Error al conectar con la base de datos')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async () => {
    if (customCategory.trim()) {
      try {
        const nuevaCat = await createCategoriaRequest(customCategory.trim(), token)
        setCategoriesList(prev => [...prev, nuevaCat])
        setNewPieceCategory(nuevaCat.id_categoria)
      } catch (err) {
        alert('Error al añadir la categoría')
      }
    }
    setCustomCategory('')
    setIsAddingCategory(false)
  }

  // Filters State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedConservation, setSelectedConservation] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)

  // Form Modal Configuration & Fields State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create' | 'edit'
  const [editingPieceId, setEditingPieceId] = useState(null)
  
  const [newPieceName, setNewPieceName] = useState('')
  const [newPieceCode, setNewPieceCode] = useState('')
  const [newPieceAuthor, setNewPieceAuthor] = useState('')
  const [newPieceCategory, setNewPieceCategory] = useState('')
  const [newPieceMaterials, setNewPieceMaterials] = useState('')
  const [newPieceConservation, setNewPieceConservation] = useState('Excelente')
  const [newPieceLocation, setNewPieceLocation] = useState('Sala 1')
  const [newPieceImage, setNewPieceImage] = useState(null)
  const [newPieceImageFile, setNewPieceImageFile] = useState(null)
  const [formError, setFormError] = useState('')

  // View Dossier (Expediente Técnico) Modal State
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedPieceForView, setSelectedPieceForView] = useState(null)

  // Link Media Modal State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [selectedPieceForLinking, setSelectedPieceForLinking] = useState(null)

  // Drag-and-Drop / Global Uploader State
  const [dragging, setDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 101, name: 'registro_partitura_scan.pdf', size: '4.82 MB', type: 'pdf' },
    { id: 102, name: 'audio_cuatro_prueba.wav', size: '12.40 MB', type: 'audio' }
  ])

  // Filters logic
  const filteredPieces = (inventario || []).filter(piece => {
    const matchesSearch = 
      (piece.titulo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (piece.codigo_qr_link || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (piece.cultor?.nombre || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (piece.cultor?.apellido || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || String(piece.id_categoria) === String(selectedCategory)
    const matchesConservation = selectedConservation === 'all' || piece.estado_conservacion === selectedConservation
    const matchesLocation = selectedLocation === 'all' || (piece.ubicacion_actual || '').startsWith(selectedLocation)

    return matchesSearch && matchesCategory && matchesConservation && matchesLocation
  })

  // Open Create Modal Handler
  const handleOpenCreateModal = () => {
    setModalMode('create')
    setEditingPieceId(null)
    setNewPieceName('')
    setNewPieceCode('')
    setNewPieceAuthor(cultoresList[0]?.id_cultor || '')
    setNewPieceCategory(categoriesList[0]?.id_categoria || '')
    setNewPieceMaterials('')
    setNewPieceConservation('Excelente')
    setNewPieceLocation('Sala 1')
    setNewPieceImage(null)
    setNewPieceImageFile(null)
    setFormError('')
    setIsModalOpen(true)
  }

  // Open Edit Modal Handler
  const handleOpenEditModal = (piece) => {
    setModalMode('edit')
    setEditingPieceId(piece.id_obra)
    setNewPieceName(piece.titulo || '')
    setNewPieceCode(piece.codigo_qr_link || '')
    setNewPieceAuthor(piece.id_cultor || '')
    setNewPieceCategory(piece.id_categoria || '')
    setNewPieceMaterials(piece.materiales_utilizados === 'No especificados' ? '' : (piece.materiales_utilizados || ''))
    setNewPieceConservation(piece.estado_conservacion || 'Excelente')
    setNewPieceLocation(piece.ubicacion_actual || 'Sala 1')
    setNewPieceImage(piece.multimedia && piece.multimedia[0] ? piece.multimedia[0].url_archivo : null)
    setNewPieceImageFile(null)
    setFormError('')
    setIsModalOpen(true)
  }

  // Handle Image upload selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (!file.type.startsWith('image/')) {
        setFormError('Por favor selecciona un archivo de imagen válido.')
        return
      }
      setNewPieceImageFile(file)
      setNewPieceImage(URL.createObjectURL(file))
    }
  }

  // Submit Handler for Form (Create/Edit)
  const handleRegisterPiece = async (e) => {
    e.preventDefault()

    if (!newPieceName.trim() || !newPieceAuthor) {
      setFormError('Por favor completa los campos obligatorios: Obra y Autor.')
      return
    }

    const selectedCultor = cultoresList.find(c => String(c.id_cultor) === String(newPieceAuthor))

    const payload = {
      titulo: newPieceName.trim(),
      id_cultor: newPieceAuthor ? parseInt(newPieceAuthor, 10) : null,
      id_categoria: newPieceCategory ? parseInt(newPieceCategory, 10) : null,
      id_parroquia: selectedCultor ? selectedCultor.id_parroquia : null,
      tipo_patrimonio: 'Material Mueble',
      materiales_utilizados: newPieceMaterials.trim() || 'No especificados',
      estado_conservacion: newPieceConservation,
      ubicacion_actual: newPieceLocation
    }

    if (modalMode === 'edit') {
      payload.codigo_qr_link = newPieceCode.trim().toUpperCase()
    }

    try {
      let savedObra
      if (modalMode === 'create') {
        savedObra = await createObraRequest(payload, token)
      } else {
        savedObra = await updateObraRequest(editingPieceId, payload, token)
      }

      // Si hay archivo de imagen seleccionado, subirlo
      if (newPieceImageFile) {
        const formData = new FormData()
        formData.append('archivo', newPieceImageFile)
        formData.append('id_obra', savedObra.id_obra)
        formData.append('tipo_archivo', 'imagen')
        formData.append('es_portada', 'si')
        await uploadMultimediaRequest(formData, token)
      }

      await cargarDatos()

      // Reset and close
      setNewPieceName('')
      setNewPieceCode('')
      setNewPieceAuthor(cultoresList[0]?.id_cultor || '')
      setNewPieceCategory(categoriesList[0]?.id_categoria || '')
      setNewPieceMaterials('')
      setNewPieceConservation('Excelente')
      setNewPieceLocation('Sala 1')
      setNewPieceImage(null)
      setNewPieceImageFile(null)
      setEditingPieceId(null)
      setFormError('')
      setIsModalOpen(false)
    } catch (err) {
      setFormError(err.message || 'Error al guardar la obra.')
    }
  }

  // Delete Piece Handler (Logical Delete)
  const handleDeletePiece = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este registro del inventario?')) {
      try {
        await deleteObraRequest(id, token)
        await cargarDatos()
      } catch (err) {
        alert('Error al eliminar la obra: ' + err.message)
      }
    }
  }

  // Open Link Media modal
  const handleOpenLinkModal = (piece) => {
    setSelectedPieceForLinking(piece)
    setIsLinkModalOpen(true)
  }

  // Toggle file link connection
  const handleToggleFileLink = (fileId) => {
    if (!selectedPieceForLinking) return
    const isLinked = selectedPieceForLinking.linkedFiles && selectedPieceForLinking.linkedFiles.includes(fileId)
    
    let updatedLinkedFiles = []
    if (isLinked) {
      updatedLinkedFiles = selectedPieceForLinking.linkedFiles.filter(id => id !== fileId)
    } else {
      updatedLinkedFiles = [...(selectedPieceForLinking.linkedFiles || []), fileId]
    }

    // Save to local selection state
    setSelectedPieceForLinking({
      ...selectedPieceForLinking,
      linkedFiles: updatedLinkedFiles
    })

    // Update in inventory state list
    setInventario(prev => prev.map(p => 
      p.id === selectedPieceForLinking.id ? { ...p, linkedFiles: updatedLinkedFiles } : p
    ))
  }

  // Drag-and-Drop Uploader functions
  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => {
    setDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).map(file => {
        let type = 'file'
        if (file.type.includes('pdf')) type = 'pdf'
        else if (file.type.includes('audio') || file.name.endsWith('.mp3') || file.name.endsWith('.wav')) type = 'audio'
        else if (file.type.includes('image')) type = 'image'

        return {
          id: Date.now() + Math.random(),
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          type
        }
      })
      setUploadedFiles([...uploadedFiles, ...files])
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).map(file => {
        let type = 'file'
        if (file.type.includes('pdf')) type = 'pdf'
        else if (file.type.includes('audio') || file.name.endsWith('.mp3') || file.name.endsWith('.wav')) type = 'audio'
        else if (file.type.includes('image')) type = 'image'

        return {
          id: Date.now() + Math.random(),
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          type
        }
      })
      setUploadedFiles([...uploadedFiles, ...files])
    }
  }

  const handleRemoveFile = (id) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id))
    // Clean links references in inventario pieces
    setInventario(prev => prev.map(p => ({
      ...p,
      linkedFiles: p.linkedFiles ? p.linkedFiles.filter(fid => fid !== id) : []
    })))
  }

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText size={18} />
      case 'audio':
        return <FileAudio size={18} />
      case 'image':
        return <FileImage size={18} />
      default:
        return <File size={18} />
    }
  }

  return (
    <div className="inventario-module-container">
      {/* 1. Cabecera de la Sección */}
      <header className="page-header">
        <div className="breadcrumbs-title">
          <nav className="breadcrumbs">
            <span>ARCHIVO</span>
            <span className="separator">&gt;</span>
            <span className="current">INVENTARIO PATRIMONIAL</span>
          </nav>
          <h1>Inventario Patrimonial</h1>
          <p className="cultor-subinfo text-light" style={{ fontSize: '14px', marginTop: '4px' }}>
            Fichas técnicas, registro multimedia y gestión de exposición cultural.
          </p>
        </div>

        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={() => setIsStandaloneCategoryModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', border: '1px solid #D2C5B4', backgroundColor: 'transparent', color: '#8B5A2B', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
            <FolderOpen size={16} />
            <span>Nueva Categoría</span>
          </button>
          <button className="btn-terracota" onClick={handleOpenCreateModal}>
            <Plus size={16} />
            <span>Nueva Obra / Pieza</span>
          </button>
        </div>
      </header>

      {/* 2. Barra de Filtros y Búsqueda */}
      <section className="filter-bar-card">
        {/* Input de Búsqueda */}
        <div className="search-input-wrapper">
          <Search className="search-input-icon" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, código de inventario o autor..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="clear-search-icon-btn"
              aria-label="Limpiar búsqueda"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Selectors */}
        <div className="selectors-wrapper">
          <select 
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setCurrentPage(1)
            }}
            className="filter-dropdown-select"
          >
            <option value="all">Categoría de Manifestación</option>
            {categoriesList.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
          </select>

          <select 
            value={selectedConservation}
            onChange={(e) => {
              setSelectedConservation(e.target.value)
              setCurrentPage(1)
            }}
            className="filter-dropdown-select"
          >
            <option value="all">Estado de Conservación</option>
            <option value="Excelente">Excelente</option>
            <option value="Deteriorado">Deteriorado</option>
            <option value="Restauración">Restauración</option>
          </select>

          <select 
            value={selectedLocation}
            onChange={(e) => {
              setSelectedLocation(e.target.value)
              setCurrentPage(1)
            }}
            className="filter-dropdown-select"
          >
            <option value="all">Ubicación</option>
            <option value="Sala">Sala</option>
            <option value="Depósito">Depósito</option>
          </select>
        </div>
      </section>

      {/* 3. Tabla de Inventario (Data Grid) */}
      <div className="card cultores-list-card">
        <div className="table-responsive">
          <table className="inventario-table">
            <thead>
              <tr>
                <th>PIEZA / OBRA</th>
                <th>AUTOR</th>
                <th>MATERIALES</th>
                <th>CONSERVACIÓN</th>
                <th>UBICACIÓN</th>
                <th>QR</th>
                <th className="text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {filteredPieces.length > 0 ? (
                filteredPieces.map((piece) => {
                  const coverImage = piece.multimedia && piece.multimedia[0] ? piece.multimedia[0].url_archivo : null;
                  return (
                    <tr key={piece.id_obra}>
                      {/* Pieza Obra (Thumbnail + Name) */}
                      <td>
                        <div 
                          className="piece-profile-cell"
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setSelectedPieceForView(piece)
                            setIsViewModalOpen(true)
                          }}
                          title="Ver ficha técnica"
                        >
                          {coverImage ? (
                            <img src={coverImage} alt={piece.titulo} className="piece-thumbnail" />
                          ) : (
                            <div className="piece-thumbnail-placeholder">
                              <Camera size={18} />
                            </div>
                          )}
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="piece-display-name">{piece.titulo}</span>
                            <span className="piece-code-info">{piece.codigo_qr_link}</span>
                          </div>
                        </div>
                      </td>

                      {/* Autor */}
                      <td>
                        <span className="author-cell-text">
                          {piece.cultor ? `${piece.cultor.primer_nombre} ${piece.cultor.primer_apellido}` : 'No asignado'}
                        </span>
                      </td>

                      {/* Materiales */}
                      <td>
                        <span className="materials-text">{piece.materiales_utilizados || 'No especificados'}</span>
                      </td>

                      {/* Conservación */}
                      <td>
                        <span className={`cons-badge ${(piece.estado_conservacion || '').toLowerCase()}`}>
                          <span className="cons-badge-dot"></span>
                          {piece.estado_conservacion || 'Excelente'}
                        </span>
                      </td>

                      {/* Ubicación */}
                      <td>
                        <span className="location-text">{piece.ubicacion_actual || 'Sala 1'}</span>
                      </td>

                      {/* QR Code Icon with Hover popup */}
                      <td>
                        <div className="qr-code-cell">
                          <QrCode size={18} />
                          <div className="qr-tooltip">
                            ID Pieza: {piece.codigo_qr_link}
                          </div>
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="text-right">
                        <div className="grid-actions-row">
                          <button 
                            className="grid-action-btn" 
                            title="Ver Expediente Técnico"
                            onClick={() => {
                              setSelectedPieceForView(piece)
                              setIsViewModalOpen(true)
                            }}
                          >
                            <FolderOpen size={16} />
                          </button>
                          <button 
                            className="grid-action-btn" 
                            title="Editar Ficha"
                            onClick={() => handleOpenEditModal(piece)}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button 
                            className="grid-action-btn" 
                            title="Vincular Multimedia"
                            onClick={() => handleOpenLinkModal(piece)}
                          >
                            <Paperclip size={15} />
                          </button>
                          <button 
                            className="grid-action-btn delete-btn" 
                            title="Eliminar Registro"
                            onClick={() => handleDeletePiece(piece.id_obra)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7">
                    <div className="empty-grid-state">
                      <Camera size={40} />
                      <p className="empty-grid-title">No se encontraron piezas patrimoniales</p>
                      <p className="empty-grid-desc">Intente ajustar los parámetros de búsqueda o filtros.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Sección de Formulario (Carga Multimedia Global) */}
      <section className="multimedia-upload-section">
        <h2 className="section-card-title">
          <UploadCloud size={18} style={{ color: '#C05640' }} />
          <span>Gestión de Carga Multimedia Patrimonial</span>
        </h2>

        {/* Drag and Drop Zone */}
        <div 
          className={`upload-drag-drop-zone ${dragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('multimedia-file-picker').click()}
        >
          <input 
            type="file" 
            id="multimedia-file-picker" 
            style={{ display: 'none' }} 
            multiple 
            onChange={handleFileSelect}
          />
          <div className="upload-icon-circle">
            <UploadCloud size={24} />
          </div>
          <p className="upload-instruction-text">
            Arrastra archivos multimedia aquí o <span>haz clic para buscar</span>
          </p>
          <p className="upload-subtext">
            Formatos admitidos: Fotos (JPG/PNG), Audios (MP3/WAV), Documentos (PDF) hasta 20MB.
          </p>
        </div>

        {/* Uploaded Files Grid */}
        {uploadedFiles.length > 0 && (
          <div className="uploaded-files-list">
            {uploadedFiles.map(file => (
              <div className="file-preview-card" key={file.id}>
                <div className="upload-icon-circle" style={{ width: '30px', height: '30px', backgroundColor: '#f1f0ee', color: '#807471', flexShrink: 0 }}>
                  {getFileIcon(file.type)}
                </div>
                <div className="file-info">
                  <span className="file-name-txt" title={file.name}>{file.name}</span>
                  <span className="file-size-txt">{file.size}</span>
                </div>
                <button 
                  className="file-remove-btn" 
                  title="Quitar archivo"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(file.id);
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Paginación */}
      <footer className="pagination-footer">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="page-item-btn"
          aria-label="Anterior"
        >
          <ChevronLeft size={16} />
        </button>
        
        <button 
          onClick={() => setCurrentPage(1)}
          className={`page-number-btn ${currentPage === 1 ? 'active' : ''}`}
        >
          1
        </button>
        
        <button 
          onClick={() => setCurrentPage(2)}
          className={`page-number-btn ${currentPage === 2 ? 'active' : ''}`}
        >
          2
        </button>

        <button 
          onClick={() => setCurrentPage(3)}
          className={`page-number-btn ${currentPage === 3 ? 'active' : ''}`}
        >
          3
        </button>

        <button 
          onClick={() => setCurrentPage(prev => Math.min(3, prev + 1))}
          disabled={currentPage === 3}
          className="page-item-btn"
          aria-label="Siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </footer>

      {/* 6. Formulario Modal: Registrar / Editar Obra */}
      {isModalOpen && (
        <div className="modal-overlay-backdrop">
          <div className="modal-box-card">
            {/* Header */}
            <div className="modal-box-header">
              <h2>{modalMode === 'create' ? 'Registrar Nueva Obra / Pieza' : 'Editar Ficha Técnica'}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="close-x-btn"
                aria-label="Cerrar modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleRegisterPiece}>
              <div className="modal-box-body">
                {formError && (
                  <div className="error-banner-group">
                    {formError}
                  </div>
                )}

                {/* Name */}
                <div className="input-box-field">
                  <label htmlFor="modal-piece-name">Nombre de la Obra / Pieza <span className="req-star">*</span></label>
                  <div className="icon-input-container">
                    <input 
                      type="text" 
                      id="modal-piece-name" 
                      placeholder="Ej. Cuatro de Cedro Tallado"
                      value={newPieceName}
                      onChange={(e) => setNewPieceName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Code and Author Row */}
                <div className="fields-split-row">
                  <div className="input-box-field">
                    <label htmlFor="modal-piece-code">Código Inventario</label>
                    <div className="icon-input-container">
                      <input 
                        type="text" 
                        id="modal-piece-code" 
                        placeholder="Generación Automática"
                        value={modalMode === 'create' ? 'Generación Automática' : newPieceCode}
                        disabled
                        style={{ backgroundColor: '#f5f4f0', cursor: 'not-allowed' }}
                      />
                    </div>
                  </div>

                  <div className="input-box-field">
                    <label htmlFor="modal-piece-author">Cultor / Autor <span className="req-star">*</span></label>
                    <div className="icon-input-container">
                      <select 
                        id="modal-piece-author" 
                        value={newPieceAuthor}
                        onChange={(e) => setNewPieceAuthor(e.target.value)}
                        required
                        style={{ flex: 1 }}
                      >
                        <option value="">Seleccione un cultor</option>
                        {cultoresList.map(c => (
                          <option key={c.id_cultor} value={c.id_cultor}>
                            {c.primer_nombre} {c.primer_apellido}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                {/* Category and Location Row */}
                <div className="fields-split-row">
                  <div className="input-box-field">
                    <label htmlFor="modal-piece-category">Categoría</label>
                    <div className="icon-input-container">
                      <select 
                        id="modal-piece-category"
                        value={newPieceCategory}
                        onChange={(e) => setNewPieceCategory(e.target.value)}
                        style={{ flex: 1 }}
                      >
                        <option value="">Seleccione una categoría</option>
                        {categoriesList.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="input-box-field">
                    <label htmlFor="modal-piece-location">Ubicación</label>
                    <div className="icon-input-container">
                      <select 
                        id="modal-piece-location"
                        value={newPieceLocation}
                        onChange={(e) => setNewPieceLocation(e.target.value)}
                        style={{ flex: 1 }}
                      >
                        <option value="Sala 1">Sala 1</option>
                        <option value="Sala 2">Sala 2</option>
                        <option value="Depósito A">Depósito A</option>
                        <option value="Depósito B">Depósito B</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Conservation and Materials Row */}
                <div className="fields-split-row">
                  <div className="input-box-field">
                    <label htmlFor="modal-piece-conservation">Estado de Conservación</label>
                    <div className="icon-input-container">
                      <select 
                        id="modal-piece-conservation"
                        value={newPieceConservation}
                        onChange={(e) => setNewPieceConservation(e.target.value)}
                        style={{ flex: 1 }}
                      >
                        <option value="Excelente">Excelente</option>
                        <option value="Deteriorado">Deteriorado</option>
                        <option value="Restauración">Restauración</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-box-field">
                    <label htmlFor="modal-piece-materials">Materiales</label>
                    <div className="icon-input-container">
                      <input 
                        type="text" 
                        id="modal-piece-materials" 
                        placeholder="Ej. Madera de Cedro, Lino"
                        value={newPieceMaterials}
                        onChange={(e) => setNewPieceMaterials(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Foto / Imagen de la obra */}
                <div className="input-box-field">
                  <label>Fotografía de la Obra / Pieza</label>
                  <div className="dossier-image-upload-wrapper">
                    {newPieceImage ? (
                      <div className="image-form-preview">
                        <img src={newPieceImage} alt="Vista previa de la obra" />
                        <button 
                          type="button" 
                          className="remove-img-form-btn"
                          onClick={() => setNewPieceImage(null)}
                        >
                          Quitar Foto
                        </button>
                      </div>
                    ) : (
                      <div className="image-form-placeholder" onClick={() => document.getElementById('piece-image-file').click()}>
                        <Camera size={20} />
                        <span>Haga clic para seleccionar una foto</span>
                        <input 
                          type="file" 
                          id="piece-image-file" 
                          accept="image/*" 
                          style={{ display: 'none' }}
                          onChange={handleImageChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-box-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-terracota">
                  {modalMode === 'create' ? 'Registrar Pieza' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Modal de Nueva Categoría (Standalone) */}
      {isStandaloneCategoryModalOpen && (
        <div className="modal-overlay-backdrop">
          <div className="modal-box-card" style={{ maxWidth: '400px' }}>
            <div className="modal-box-header">
              <h2>Añadir Nueva Categoría</h2>
              <button 
                onClick={() => setIsStandaloneCategoryModalOpen(false)}
                className="close-x-btn"
                aria-label="Cerrar modal"
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-box-body">
              <div className="input-box-field">
                <label htmlFor="standalone-category-name">Nombre de la Categoría <span className="req-star">*</span></label>
                <div className="icon-input-container">
                  <FolderOpen size={15} className="field-icon-left" />
                  <input 
                    type="text" 
                    id="standalone-category-name" 
                    placeholder="Ej. Fotografía Histórica"
                    value={standaloneCategoryName}
                    onChange={(e) => setStandaloneCategoryName(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
            </div>
            <div className="modal-box-footer">
              <button type="button" className="btn-secondary" onClick={() => { setIsStandaloneCategoryModalOpen(false); setStandaloneCategoryName(''); }}>
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn-terracota" 
                onClick={async () => {
                  if (standaloneCategoryName.trim()) {
                    try {
                      const nuevaCat = await createCategoriaRequest(standaloneCategoryName.trim(), token);
                      setCategoriesList([...categoriesList, nuevaCat]);
                    } catch (err) {
                      alert('Error al crear categoría: ' + err.message);
                    }
                  }
                  setStandaloneCategoryName('');
                  setIsStandaloneCategoryModalOpen(false);
                }}
              >
                Guardar Categoría
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Modal de Vista: Expediente Técnico Detallado */}
      {isViewModalOpen && selectedPieceForView && (
        <div className="modal-overlay-backdrop">
          <div className="modal-box-card dossier-modal">
            {/* Header */}
            <div className="modal-box-header">
              <h2>Expediente Técnico Patrimonial</h2>
              <button 
                onClick={() => {
                  setIsViewModalOpen(false)
                  setSelectedPieceForView(null)
                }}
                className="close-x-btn"
                aria-label="Cerrar expediente"
              >
                <X size={18} />
              </button>
            </div>

            {/* Dossier Body */}
            <div className="modal-box-body">
              {/* Image Banner */}
              <div className="dossier-image-banner">
                {selectedPieceForView.multimedia && selectedPieceForView.multimedia[0] ? (
                  <img src={selectedPieceForView.multimedia[0].url_archivo} alt={selectedPieceForView.titulo} className="dossier-featured-img" />
                ) : (
                  <div className="dossier-no-image">
                    <Camera size={32} />
                    <span>Sin registro fotográfico</span>
                  </div>
                )}
              </div>

              {/* Title & Metadata */}
              <div className="dossier-profile-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
                <div className="dossier-profile-meta">
                  <h3 style={{ fontSize: '15px' }}>{selectedPieceForView.titulo}</h3>
                  <span className="dossier-sub">Código Inventario: <strong>{selectedPieceForView.codigo_qr_link}</strong></span>
                </div>
                <div>
                  <span className={`cons-badge ${(selectedPieceForView.estado_conservacion || '').toLowerCase()}`}>
                    <span className="cons-badge-dot"></span>
                    {selectedPieceForView.estado_conservacion || 'Excelente'}
                  </span>
                </div>
              </div>

              {/* Detailed Grid */}
              <div className="dossier-grid">
                <div className="dossier-field">
                  <span className="dossier-label">Autor / Cultor Asociado:</span>
                  <span className="dossier-value">
                    {selectedPieceForView.cultor ? `${selectedPieceForView.cultor.primer_nombre} ${selectedPieceForView.cultor.primer_apellido}` : 'No asignado'}
                  </span>
                </div>
                <div className="dossier-field">
                  <span className="dossier-label">Categoría de Manifestación:</span>
                  <span className="dossier-value">
                    {selectedPieceForView.categoria ? selectedPieceForView.categoria.nombre : 'No asignada'}
                  </span>
                </div>
                <div className="dossier-field">
                  <span className="dossier-label">Materiales / Elementos:</span>
                  <span className="dossier-value">{selectedPieceForView.materiales_utilizados || 'No especificados'}</span>
                </div>
                <div className="dossier-field">
                  <span className="dossier-label">Ubicación Física:</span>
                  <span className="dossier-value">{selectedPieceForView.ubicacion_actual || 'Sala 1'}</span>
                </div>
              </div>

              {/* Connected Multimedia */}
              <div className="checkboxes-box-panel">
                <span className="checkboxes-box-title">Documentación & Soportes Multimedia Vinculados</span>
                <div className="dossier-document-row">
                  {selectedPieceForView.linkedFiles && selectedPieceForView.linkedFiles.length > 0 ? (
                    selectedPieceForView.linkedFiles.map(fileId => {
                      const file = uploadedFiles.find(f => f.id === fileId)
                      if (!file) return null
                      return (
                        <div key={file.id} className="doc-status-item verified">
                          <span className="dot" style={{ backgroundColor: '#C05640' }}></span>
                          <span>{file.name} ({file.size})</span>
                        </div>
                      )
                    })
                  ) : (
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      No hay archivos multimedia vinculados a esta pieza. Utiliza el ícono de vinculación en la tabla para asociar soportes.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-box-footer">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => {
                  setIsViewModalOpen(false)
                  setSelectedPieceForView(null)
                }}
              >
                Cerrar Expediente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Modal de Vinculación de Multimedia */}
      {isLinkModalOpen && selectedPieceForLinking && (
        <div className="modal-overlay-backdrop">
          <div className="modal-box-card">
            {/* Header */}
            <div className="modal-box-header">
              <h2>Vincular Soportes Multimedia</h2>
              <button 
                onClick={() => {
                  setIsLinkModalOpen(false)
                  setSelectedPieceForLinking(null)
                }}
                className="close-x-btn"
                aria-label="Cerrar modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Link Body */}
            <div className="modal-box-body">
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                Selecciona los archivos de la biblioteca multimedia global que deseas vincular al expediente técnico de: <strong>{selectedPieceForLinking.name}</strong>.
              </p>

              {/* Scrollable list */}
              <div className="linking-scroll-panel">
                {uploadedFiles.length > 0 ? (
                  uploadedFiles.map(file => {
                    const isLinked = selectedPieceForLinking.linkedFiles && selectedPieceForLinking.linkedFiles.includes(file.id)
                    return (
                      <label key={file.id} className="linking-checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={isLinked}
                          onChange={() => handleToggleFileLink(file.id)}
                        />
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getFileIcon(file.type)}
                          <span>{file.name}</span>
                        </span>
                        <span className="file-size">{file.size}</span>
                      </label>
                    )
                  })
                ) : (
                  <div className="empty-grid-state" style={{ padding: '24px 0' }}>
                    <UploadCloud size={32} />
                    <p className="empty-grid-title" style={{ fontSize: '13px' }}>No hay archivos multimedia cargados</p>
                    <p className="empty-grid-desc" style={{ fontSize: '11px' }}>Sube archivos primero en el panel multimedia general.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="modal-box-footer">
              <button 
                type="button" 
                className="btn-terracota" 
                onClick={() => {
                  setIsLinkModalOpen(false)
                  setSelectedPieceForLinking(null)
                }}
              >
                Listo / Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InventarioPatrimonial
