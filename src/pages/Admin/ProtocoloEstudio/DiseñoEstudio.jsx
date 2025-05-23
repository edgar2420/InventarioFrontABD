import React, { useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Paper,
  Button,
  IconButton,
  Modal,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const DiseñoEstudio = ({ lotes, setLotes }) => {
  const [editIndex, setEditIndex] = useState(null);
  const [editedLote, setEditedLote] = useState({});

  const handleChange = (index, field, value) => {
    const nuevosLotes = [...lotes];
    nuevosLotes[index][field] = value;
    setLotes(nuevosLotes);
  };

  const agregarLote = () => {
    setLotes([
      ...lotes,
      { numero: "", tamano: "", fecha: "", tipo: "", duracion: "" },
    ]);
  };

  const eliminarLote = (index) => {
    const nuevosLotes = lotes.filter((_, i) => i !== index);
    setLotes(nuevosLotes);
  };

  const abrirModalEditar = (index) => {
    setEditIndex(index);
    setEditedLote({ ...lotes[index] });
  };

  const guardarEdicion = () => {
    const nuevosLotes = [...lotes];
    nuevosLotes[editIndex] = editedLote;
    setLotes(nuevosLotes);
    setEditIndex(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2, mt: 2 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Diseño del Estudio
      </Typography>
      <Grid container spacing={2}>
        {lotes.map((lote, index) => (
          <React.Fragment key={index}>
            <Grid item xs={12} sm={2} md={2}>
              <TextField
                label="N° de Lote"
                size="small"
                value={lote.numero || ""}
                onChange={(e) => handleChange(index, "numero", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={5} md={5}>
              <TextField
                label="Tamaño de lote"
                size="small"
                value={lote.tamano || ""}
                onChange={(e) => handleChange(index, "tamano", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={5} md={5}>
              <TextField
                label="Fecha de fabricación"
                type="date"
                size="small"
                value={lote.fecha || ""}
                onChange={(e) => handleChange(index, "fecha", e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <TextField
                label="Tipo de lote"
                size="small"
                value={lote.tipo || ""}
                onChange={(e) => handleChange(index, "tipo", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <TextField
                label="Duración"
                type="date"
                size="small"
                value={lote.duracion || ""}
                onChange={(e) => handleChange(index, "duracion", e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconButton color="primary" size="small" onClick={() => abrirModalEditar(index)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton color="error" size="small" onClick={() => eliminarLote(index)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Grid>
          </React.Fragment>
        ))}

        <Grid item xs={12}>
          <Button variant="outlined" onClick={agregarLote}>
            + Agregar Lote
          </Button>
        </Grid>
      </Grid>

      {/* Modal para editar lote */}
      <Modal open={editIndex !== null} onClose={() => setEditIndex(null)}>
        <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, maxWidth: 400, mx: 'auto', mt: 10 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Editar Lote
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="N° de Lote"
                size="small"
                fullWidth
                value={editedLote.numero || ""}
                onChange={(e) => setEditedLote({ ...editedLote, numero: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Tamaño de lote"
                size="small"
                fullWidth
                value={editedLote.tamano || ""}
                onChange={(e) => setEditedLote({ ...editedLote, tamano: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Fecha de fabricación"
                type="date"
                size="small"
                fullWidth
                value={editedLote.fecha || ""}
                onChange={(e) => setEditedLote({ ...editedLote, fecha: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Tipo de lote"
                size="small"
                fullWidth
                value={editedLote.tipo || ""}
                onChange={(e) => setEditedLote({ ...editedLote, tipo: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Duración"
                type="date"
                size="small"
                fullWidth
                value={editedLote.duracion || ""}
                onChange={(e) => setEditedLote({ ...editedLote, duracion: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} textAlign="right">
              <Button variant="contained" color="primary" onClick={guardarEdicion}>
                Guardar Cambios
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Paper>
  );
};

export default DiseñoEstudio;
