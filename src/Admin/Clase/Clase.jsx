import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, X, Pencil, Trash2, Check } from 'lucide-react'
import { toast } from 'react-toastify'
import {
  obtenerClases,
  crearClase,
  editarClase,
  eliminarClase
} from '../../../src/services/Clase'
import 'react-toastify/dist/ReactToastify.css'
import './CrearClase.css'

const CrearClase = () => {
  const [nombre, setNombre] = useState('')
  const [clases, setClases] = useState([])
  const [editandoId, setEditandoId] = useState(null)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [filtro, setFiltro] = useState('')
  const navigate = useNavigate()

  const cargarClases = async () => {
    try {
      const data = await obtenerClases()
      setClases(data.sort((a, b) => a.nombre.localeCompare(b.nombre)))
    } catch {
      toast.error('Error al cargar clases')
    }
  }

  useEffect(() => {
    cargarClases()
  }, [])

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      toast.error('El nombre de la clase es obligatorio')
      return
    }

    try {
      await crearClase({ nombre: nombre.trim() })
      toast.success('Clase guardada ✅')
      setNombre('')
      cargarClases()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al guardar clase')
    }
  }

  const handleEliminar = (id, nombre) => {
    toast(
      () => (
        <div>
          <p>¿Eliminar <strong>{nombre}</strong>?</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              onClick={async () => {
                try {
                  await eliminarClase(id)
                  toast.dismiss()
                  toast.success('Eliminado ✅')
                  cargarClases()
                } catch {
                  toast.dismiss()
                  toast.error('Error al eliminar')
                }
              }}
              style={{ background: '#ef4444', color: 'white', padding: '0.3rem 0.75rem', border: 'none', borderRadius: '0.3rem' }}
            >
              Eliminar
            </button>
            <button onClick={() => toast.dismiss()} style={{ background: '#e5e7eb', padding: '0.3rem 0.75rem', border: 'none', borderRadius: '0.3rem' }}>
              Cancelar
            </button>
          </div>
        </div>
      ),
      { position: 'top-center', autoClose: false }
    )
  }

  const handleGuardarEdicion = async (id) => {
    if (!nuevoNombre.trim()) return toast.error('El nombre no puede estar vacío')
    try {
      await editarClase(id, { nombre: nuevoNombre.trim() })
      toast.success('Clase actualizada ✅')
      setEditandoId(null)
      cargarClases()
    } catch {
      toast.error('No se pudo actualizar')
    }
  }

  const clasesFiltradas = clases.filter(c =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div className="clase-container">
      <div className="clase-box">
        <h2 className="clase-titulo">
          <PlusCircle size={24} /> Crear Clase
        </h2>

        <div className="clase-form">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="clase-input"
            placeholder="Ej: Mecánico, Eléctrico"
          />
          <button onClick={handleGuardar} className="clase-btn guardar">
            <PlusCircle size={16} /> Guardar Clase
          </button>
          <button onClick={() => navigate(-1)} className="clase-btn cancelar" title="Cancelar">
            <X size={18} />
          </button>
        </div>

        <input
          type="text"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar clase..."
          className="clase-buscar"
        />

        <ul className="unidad-lista">
          {clasesFiltradas.map(c => (
            <li key={c.id} className="unidad-item">
              {editandoId === c.id ? (
                <input
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="unidad-edit-input"
                  autoFocus
                />
              ) : (
                <span>{c.nombre}</span>
              )}

              <div className="unidad-acciones">
                {editandoId === c.id ? (
                  <>
                    <button onClick={() => handleGuardarEdicion(c.id)} className="unidad-btn-icon edit">
                      <Check size={18} />
                    </button>
                    <button onClick={() => setEditandoId(null)} className="unidad-btn-icon delete">
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditandoId(c.id)
                        setNuevoNombre(c.nombre)
                      }}
                      className="unidad-btn-icon edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleEliminar(c.id, c.nombre)}
                      className="unidad-btn-icon delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default CrearClase
