import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, X, Pencil, Trash2, Check } from 'lucide-react'
import { toast } from 'react-toastify'
import {
  ObtenerTipo,
  crearTipo,
  editarTipo,
  eliminarTipo
} from '../../../src/services/Tipo'
import { obtenerClases } from '../../../src/services/Clase'
import 'react-toastify/dist/ReactToastify.css'
import './CrearTipo.css'

const CrearTipo = () => {
  const [nombre, setNombre] = useState('')
  const [claseId, setClaseId] = useState('')
  const [clases, setClases] = useState([])
  const [tipos, setTipos] = useState([])
  const [editandoId, setEditandoId] = useState(null)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [filtro, setFiltro] = useState('')
  const navigate = useNavigate()

  const cargarDatos = async () => {
    try {
      const [clasesData, tiposData] = await Promise.all([
        obtenerClases(),
        ObtenerTipo()
      ])
      setClases(clasesData)
      setTipos(tiposData.sort((a, b) => a.nombre.localeCompare(b.nombre)))
    } catch {
      toast.error('Error al cargar datos')
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  const handleGuardar = async () => {
    if (!nombre.trim() || !claseId) {
      toast.error('Debes ingresar nombre del tipo y seleccionar una clase')
      return
    }

    try {
      await crearTipo({ nombre: nombre.trim(), clase_id: parseInt(claseId) })
      toast.success('Tipo guardado ✅')
      setNombre('')
      setClaseId('')
      cargarDatos()
    } catch {
      toast.error('Error al guardar tipo')
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
                  await eliminarTipo(id)
                  toast.dismiss()
                  toast.success('Eliminado ✅')
                  cargarDatos()
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
      await editarTipo(id, { nombre: nuevoNombre.trim() })
      toast.success('Tipo actualizado ✅')
      setEditandoId(null)
      cargarDatos()
    } catch {
      toast.error('No se pudo actualizar')
    }
  }

  const tiposFiltrados = tipos.filter(t =>
    t.nombre.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div className="creartipo-container">
      <div className="creartipo-box">
        <h2 className="creartipo-titulo">
          <PlusCircle size={24} /> Crear Tipo
        </h2>

        <div className="creartipo-form">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="creartipo-input"
            placeholder="Ej: Motor, Sensor, Bomba"
          />

          <select
            value={claseId}
            onChange={(e) => setClaseId(e.target.value)}
            className="creartipo-select"
          >
            <option value="">-- Selecciona una clase --</option>
            {clases.map(clase => (
              <option key={clase.id} value={clase.id}>{clase.nombre}</option>
            ))}
          </select>

          <button onClick={handleGuardar} className="creartipo-btn guardar">
            <PlusCircle size={16} /> Guardar Tipo
          </button>

          <button onClick={() => navigate(-1)} className="creartipo-btn cancelar">
            <X size={18} />
          </button>
        </div>

        <input
          type="text"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar tipo..."
          className="creartipo-input"
        />

        <ul className="unidad-lista">
          {tiposFiltrados.map(t => (
            <li key={t.id} className="unidad-item">
              {editandoId === t.id ? (
                <input
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="unidad-edit-input"
                  autoFocus
                />
              ) : (
                <span>{t.nombre}</span>
              )}

              <div className="unidad-acciones">
                {editandoId === t.id ? (
                  <>
                    <button onClick={() => handleGuardarEdicion(t.id)} className="unidad-btn-icon edit">
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
                        setEditandoId(t.id)
                        setNuevoNombre(t.nombre)
                      }}
                      className="unidad-btn-icon edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleEliminar(t.id, t.nombre)}
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

export default CrearTipo

