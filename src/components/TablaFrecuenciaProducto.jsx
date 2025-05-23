import React, { useEffect, useState } from "react";
import { obtenerFrecuenciaPorProductoYTipo } from "../services/FrecuenciaMuestreoProductoService";

// Tiempos exactos según la imagen
const tiemposPorTipo = {
  "ESTABILIDAD NATURAL (ESTABLE)": ["T0", "T1", "T2", "T3", "T4", "T5", "T6", "Extra"],
  "ESTABILIDAD ACELERADA (ESTABLE)": ["T0", "T1", "T2", "Extra"],
  "ESTABILIDAD ON GOING (ESTABLE)": ["T0", "T1", "T2", "T3", "T4", "T5", "Extra"],
  "ESTUDIO DE EXCURSIÓN (ESTABLE)": [],

  "ESTABILIDAD NATURAL (MENOS ESTABLE)": [
    "T0", "T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "Extra"
  ],
  "ESTABILIDAD ACELERADA (MENOS ESTABLE)": ["T0", "T1", "T2", "T3", "T4", "Extra"],
  "ESTABILIDAD ON GOING (MENOS ESTABLE)": ["T0", "T1", "T2", "T3", "T4", "T5", "T6", "T7", "Extra"],
  "ESTUDIO DE EXCURSIÓN (MENOS ESTABLE)": [],
};

// Descripción de los tiempos en meses, exactamente como en la tabla
const descripcionTiempos = {
  "ESTABILIDAD NATURAL (ESTABLE)": {
    T0: "0 meses", T1: "6 meses", T2: "12 meses", T3: "24 meses",
    T4: "36 meses", T5: "48 meses", T6: "60 meses", Extra: ""
  },
  "ESTABILIDAD ACELERADA (ESTABLE)": {
    T0: "0 meses", T1: "3 meses", T2: "6 meses", Extra: ""
  },
  "ESTABILIDAD ON GOING (ESTABLE)": {
    T0: "0 meses", T1: "12 meses", T2: "24 meses", T3: "36 meses",
    T4: "48 meses", T5: "60 meses", Extra: ""
  },
  "ESTABILIDAD NATURAL (MENOS ESTABLE)": {
    T0: "0 meses", T1: "3 meses", T2: "6 meses", T3: "9 meses",
    T4: "12 meses", T5: "18 meses", T6: "24 meses", T7: "36 meses",
    T8: "48 meses", T9: "60 meses", Extra: ""
  },
  "ESTABILIDAD ACELERADA (MENOS ESTABLE)": {
    T0: "0 meses", T1: "1 mes", T2: "2 meses", T3: "3 meses",
    T4: "6 meses", Extra: ""
  },
  "ESTABILIDAD ON GOING (MENOS ESTABLE)": {
    T0: "0 meses", T1: "6 meses", T2: "12 meses", T3: "18 meses",
    T4: "24 meses", T5: "36 meses", T6: "48 meses", T7: "60 meses", Extra: ""
  },
  "ESTUDIO DE EXCURSIÓN (ESTABLE)": {},
  "ESTUDIO DE EXCURSIÓN (MENOS ESTABLE)": {},
};

const parametros = [
  { key: "aspecto", label: "Aspecto" },
  { key: "hermeticidad", label: "Hermeticidad" },
  { key: "ph", label: "pH" },
  { key: "valoracion", label: "Valoración" },
  { key: "particulas_visibles", label: "Partículas visibles" },
  { key: "pruebas_microbiologicas", label: "Pruebas microbiológicas" },
  { key: "rectificacion", label: "Rectificación" },
];

const TablaFrecuenciaProducto = ({ productoId, tipoEstudio }) => {
  const [frecuencia, setFrecuencia] = useState(null);
  const tiempos = tiemposPorTipo[tipoEstudio] || [];

  useEffect(() => {
    const fetchData = async () => {
      if (!productoId || !tipoEstudio) return;
      try {
        const data = await obtenerFrecuenciaPorProductoYTipo(productoId, tipoEstudio);
        console.log("Frecuencia data:", data);
        setFrecuencia(data || null);
      } catch (error) {
        console.error("Error al obtener frecuencia:", error);
        setFrecuencia(null);
      }
    };
    fetchData();
  }, [productoId, tipoEstudio]);

  const tabla = parametros.map(({ key, label }) => {
    const cantidad = frecuencia?.[key] || 0;
    const celdas = tiempos.map(() => cantidad);
    const totalFila = celdas.reduce((a, b) => a + b, 0);
    return { label, cantidad, celdas, totalFila };
  });

  const totalColumna = tiempos.map((_, i) =>
    tabla.reduce((sum, fila) => sum + fila.celdas[i], 0)
  );
  const totalLote = totalColumna.reduce((a, b) => a + b, 0);

  return (
    <div className="overflow-x-auto mt-6 border rounded shadow-md">
      <table className="table-auto w-full text-center border-collapse">
        <thead className="bg-blue-200 text-sm">
          <tr>
            <th className="border px-2 py-1">Especificaciones</th>
            <th className="border px-2 py-1">Cantidad de muestra (Env.)</th>
            {tiempos.map((t) => (
              <th key={t} className="border px-2 py-1">
                {t} {descripcionTiempos[tipoEstudio]?.[t] && `(${descripcionTiempos[tipoEstudio][t]})`}
              </th>
            ))}
            <th className="border px-2 py-1">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {tabla.map((fila, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">{fila.label}</td>
              <td className="border px-2 py-1">{fila.cantidad}</td>
              {fila.celdas.map((val, i) => (
                <td key={i} className="border px-2 py-1">{val}</td>
              ))}
              <td className="border px-2 py-1 font-bold">{fila.totalFila}</td>
            </tr>
          ))}
          <tr className="bg-blue-100 font-bold">
            <td colSpan={2} className="border px-2 py-1 text-right">Total por tiempo:</td>
            {totalColumna.map((val, i) => (
              <td key={i} className="border px-2 py-1">{val}</td>
            ))}
            <td className="border px-2 py-1">{totalLote}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TablaFrecuenciaProducto;
