import { useEffect, useState } from 'react'
import { obtenerMovimientos } from '../../../src/services/Movimiento'
import { History } from 'lucide-react'
import './movimientos.css'

const ListaMovimientos = () => {
  const [movimientos, setMovimientos] = useState([])

  useEffect(() => {
    const cargar = async () => {
      const data = await obtenerMovimientos()
      setMovimientos(data)
    }
    cargar()
  }, [])

  return (
    <div className="producto-container">
      <div className="form-box">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-blue-600 text-2xl font-bold flex items-center gap-2">
            <History size={24} /> Historial de Entradas y Salidas
          </h2>
        </div>

        <div className="tabla-wrapper">
          <table className="tabla">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Componente</th>
                <th>Cantidad</th>
                <th>Persona</th>
                <th>Orden Trabajo</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.length > 0 ? (
                movimientos.map((m) => (
                  <tr key={m.id}>
                    <td>{new Date(m.fecha).toLocaleString()}</td>
                    <td>{m.tipo}</td>
                    <td>{m.nombre_componente || m.componente_codigo}</td>
                    <td>{m.cantidad}</td>
                    <td>{m.persona}</td>
                    <td>{m.orden_trabajo || '-'}</td>
                    <td>{m.observaciones || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-datos">No hay movimientos registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ListaMovimientos
