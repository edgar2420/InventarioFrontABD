import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const FrecuenciaMuestreo = ({ frecuencia, onEdit, onDelete }) => {
  return (
    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Tipo de Estudio</th>
            <th>pH</th>
            <th>Valoración</th>
            <th>Partículas Visibles</th>
            <th>Pruebas Microbiológicas</th>
            <th>Rectificación</th>
            <th>Aspecto</th>
            <th>Hermeticidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {frecuencia.map((f) => (
            <tr key={f.id}>
              <td>{f.productoNombre}</td>
              <td>{f.tipo_estudio}</td>
              <td>{f.ph}</td>
              <td>{f.valoracion}</td>
              <td>{f.particulas_visibles}</td>
              <td>{f.pruebas_microbiologicas}</td>
              <td>{f.rectificacion}</td>
              <td>{f.aspecto}</td>
              <td>{f.hermeticidad}</td>
              <td className="action-buttons-cell">
                <FaEdit className="icon-edit" onClick={() => onEdit(f)} title="Editar" />
                <FaTrash className="icon-delete" onClick={() => onDelete(f.id)} title="Eliminar" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FrecuenciaMuestreo;
