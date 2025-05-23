import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { obtenerComponentePorCodigo } from '../../../src/services/Componente'
import { PackageOpen, ArrowLeftCircle } from 'lucide-react'
import './detalleComponente.css'

const DetalleComponente = () => {
  const { codigo } = useParams()
  const navigate = useNavigate()
  const [componente, setComponente] = useState(null)

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerComponentePorCodigo(codigo)
        setComponente(data)
      } catch (err) {
        console.error('Error al obtener componente:', err)
        setComponente(null)
      }
    }

    cargar()
  }, [codigo])

  if (!componente) return <p className="text-center mt-10">Cargando...</p>

  return (
    <div className="producto-container">
      <div className="form-box">
        <div className="flex items-center justify-between mb-6">
          <h2 className="titulo-lista">
            <PackageOpen size={24} /> Detalle del Componente
          </h2>
          <button className="btn btn-subir flex items-center gap-2" onClick={() => navigate('/componentes')}>
            <ArrowLeftCircle size={18} /> Volver
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Código:</strong> {componente.codigo}</p>
          <p><strong>Nombre:</strong> {componente.nombre}</p>
          <p><strong>Clase:</strong> {componente.clase?.nombre || '-'}</p>
          <p><strong>Tipo:</strong> {componente.tipo?.nombre || '-'}</p>
          <p><strong>Modelo:</strong> {componente.modelo}</p>
          <p><strong>Marca:</strong> {componente.marca}</p>
          <p><strong>Fabricante:</strong> {componente.fabricante}</p>
          <p><strong>Unidad de Proceso:</strong> {componente.unidad_proceso?.nombre || '-'}</p>
          <p><strong>Cantidad:</strong> {componente.cantidad}</p>
        </div>

        {componente.imagen_url && (
          <div className="mt-6 text-center">
            <img
              src={componente.imagen_url}
              alt="Imagen del componente"
              className="w-64 mx-auto rounded border border-gray-300 shadow"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default DetalleComponente

