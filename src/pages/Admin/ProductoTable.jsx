import React from 'react';
import { FaEdit, FaTrash } from "react-icons/fa";

const ProductoTable = ({ productos, openEditModal, handleDelete }) => {
  const mostrar = (valor) => valor ?? "N/A";

  return (
    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
      <div style={{ overflowX: 'auto' }}>
        <table className="custom-table" style={{ borderCollapse: 'collapse', minWidth: '1600px' }}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Lote</th>
              <th>Envase</th>
              <th>Volúmenes</th>
              <th>Hermeticidad</th>
              <th>Aspecto</th>
              <th>pH Min</th>
              <th>pH Max</th>
              <th>Conductividad</th>
              <th>Recuento microbiano Min</th>
              <th>Recuento microbiano Max</th>
              <th>Referencia Documental</th>
              <th>Impurezas</th>
              <th>Partículas</th>
              <th className="acciones-col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(productos) && productos.length > 0 ? (
              productos.map((producto, index) => (
                <tr key={index}>
                  <td>{mostrar(producto.nombre)}</td>
                  <td>{mostrar(producto.lote)}</td>
                  <td>{mostrar(producto.envase)}</td>
                  <td>
                    {producto.volumenes?.length
                      ? producto.volumenes.map(v => `No menor a ${v.cantidad} ${v.unidad}`).join(" | ")
                      : "N/A"}
                  </td>
                  <td>{mostrar(producto.hermeticidad)}</td>
                  <td>{mostrar(producto.aspecto)}</td>
                  <td>{mostrar(producto.phMin)}</td>
                  <td>{mostrar(producto.phMax)}</td>
                  <td>{mostrar(producto.conductividad)}</td>
                  <td>{mostrar(producto.recuentoMicrobianoMin)}</td>
                  <td>{mostrar(producto.recuentoMicrobianoMax)}</td>
                  <td>{mostrar(producto.referenciaDocumental)}</td>
                  <td>{mostrar(producto.impurezas)}</td>
                  <td>{mostrar(producto.particulas)}</td>
                  <td className="acciones-col" style={{ background: '#fff' }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <FaEdit
                        className="icon-edit"
                        onClick={() => openEditModal(producto)}
                        title="Editar"
                        style={{ cursor: 'pointer' }}
                      />
                      <FaTrash
                        className="icon-delete"
                        onClick={() => handleDelete(producto.id)}
                        title="Eliminar"
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="15" style={{ textAlign: 'center', padding: '20px' }}>
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .acciones-col {
          position: sticky;
          right: 0;
          z-index: 1;
          min-width: 100px;
          background-color: white;
          box-shadow: -2px 0 5px rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
};

export default ProductoTable;
