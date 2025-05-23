import { useEffect, useState } from 'react'
import { ObtenerTipo, eliminarTipo, editarTipo } from '../../../src/services/Tipo'
import { Pencil, Trash2, Check, X, PlusCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import './UnidadProceso.css'

const ListaTipos = () => {
  const [tipos, setTipos] = useState([])
  const [filtro, setFiltro] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const navigate = useNavigate()

  const cargarTipos = async () => {
    try {
      const data = await ObtenerTipo()
      const ordenados = data.sort((a, b) => a.nombre.localeCompare(b.nombre))
      setTipos(ordenados)
    } catch {
      toast.error('Error al cargar tipos')
    }
  }

  useEffect(() => {
    cargarTipos()
  }, [])

  const handleGuardarEdicion = async (id) => {
    if (!nuevoNombre.trim()) return toast.error('El nombre no puede estar vacío')
    try {
      await editarTipo(id, { nombre: nuevoNombre.trim() })
      toast.success('Tipo actualizado ✅')
      setEditandoId(null)
      cargarTipos()
    } catch {
      toast.error('No se pudo actualizar')
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
                  cargarTipos()
                } catch {
                  toast.dismiss()
                  toast.error('Error al eliminar')
                }
              }}
              style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '0.3rem' }}
            >
              Eliminar
            </button>
            <button onClick={() => toast.dismiss()} style={{ background: '#e5e7eb', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '0.3rem' }}>
              Cancelar
            </button>
          </div>
        </div>
      ),
      { position: 'top-center', autoClose: false, closeOnClick: false }
    )
  }

  const tiposFiltrados = tipos.filter(t => t.nombre.toLowerCase().includes(filtro.toLowerCase()))

  return (
    <div className="unidad-container">
      <div className="unidad-box">
        <h2 className="unidad-titulo">
          <PlusCircle size={24} /> Tipos Registrados
        </h2>

        <input
          type="text"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar tipo..."
          className="unidad-input buscador"
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
                    <button onClick={() => { setEditandoId(t.id); setNuevoNombre(t.nombre) }} className="unidad-btn-icon edit">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleEliminar(t.id, t.nombre)} className="unidad-btn-icon delete">
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-end mt-4">
          <button onClick={() => navigate('/crear-tipo')} className="unidad-btn agregar">
            <PlusCircle size={16} /> Nuevo Tipo
          </button>
        </div>
      </div>
    </div>
  )
}

export default ListaTipos
