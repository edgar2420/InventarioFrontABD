import React from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const EspecificacionesEvaluacion = ({ especificaciones = [] }) => {
  if (!especificaciones.length) return null;

  const renderSeccion = (titulo, tipoFiltro) => {
    const datos = especificaciones.filter((e) => e.tipo === tipoFiltro);
    console.log(`📊 Datos de tipo "${tipoFiltro}" →`, datos);
    if (!datos.length) return null;

    return (
      <>
        <TableRow key={`${tipoFiltro}-header`}>
          <TableCell
            colSpan={2}
            sx={{
              fontWeight: "bold",
              backgroundColor:
                tipoFiltro === "especificacion"
                  ? "#c5e1f7"
                  : tipoFiltro === "valoracion"
                    ? "#d0f0c0"
                    : "#f0f0f0",
              color: "#000",
            }}
          >
            {titulo}
          </TableCell>
        </TableRow>
        {datos.map((fila, idx) => (
          <TableRow key={`${tipoFiltro}-${idx}`}>
            <TableCell>{fila.nombre}</TableCell>
            <TableCell>{fila.criterio}</TableCell>
          </TableRow>
        ))}
      </>
    );
  };

  return (
    <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Especificaciones a Evaluar y Criterio de Aceptación
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>Parámetro</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Criterio de Aceptación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderSeccion("Especificaciones", "especificacion")}
            {renderSeccion("Valoraciones", "valoracion")}
            {renderSeccion("Pruebas microbiológicas", "prueba_microbiologica")}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default EspecificacionesEvaluacion;
