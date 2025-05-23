import React, { useEffect, useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  getProductosPorClasificacion,
  obtenerDetalleProducto
} from "../../../services/ProductoService";
import { obtenerFrecuenciaPorProductoYTipo } from "../../../services/FrecuenciaMuestreoProductoService";
import { Autocomplete } from "@mui/material";
import DiseñoEstudio from "./DiseñoEstudio";
import EspecificacionesEvaluacion from "./EspecificacionesEvaluacion";
import TablaFrecuenciaProducto from "../../../components/TablaFrecuenciaProducto";
import ProtocoloExportarPDF from "./ProtocoloExportarPDF";

const ProtocoloForm = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [productoIdSeleccionado, setProductoIdSeleccionado] = useState(null);
  const [formaFarmaceutica, setFormaFarmaceutica] = useState("");
  const [envasePrimario, setEnvasePrimario] = useState("");
  const [volumenNominal, setVolumenNominal] = useState("");
  const [volumenCantidad, setVolumenCantidad] = useState("");
  const [volumenUnidad, setVolumenUnidad] = useState("");
  const [volumenes, setVolumenes] = useState([]);
  const [formulasPorVolumen, setFormulasPorVolumen] = useState([]);
  const [frecuenciaData, setFrecuenciaData] = useState(null);
  const [formulaTabla, setFormulaTabla] = useState([]);
  const [temperatura, setTemperatura] = useState("");
  const [humedad, setHumedad] = useState("");
  const [tipoEstudio, setTipoEstudio] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [lotes, setLotes] = useState([{ numero: "", tamano: "", fecha: "", tipo: "", duracion: "" }]);
  const [especificaciones, setEspecificaciones] = useState([]);
  const [clasificacion, setClasificacion] = useState("");
  const fechaActual = new Date().toLocaleDateString("es-BO");

  useEffect(() => {
    const fetchProductosPorClasificacion = async () => {
      if (!clasificacion) return;
      try {
        const lista = await getProductosPorClasificacion(clasificacion);
        setProductos(lista);
        setProductoSeleccionado("");
      } catch (error) {
        console.error("Error al cargar productos por clasificación:", error);
      }
    };
    fetchProductosPorClasificacion();
  }, [clasificacion]);

  useEffect(() => {
    const fetchFrecuencia = async () => {
      if (!productoIdSeleccionado || !tipoEstudio || !clasificacion) return;
      try {
        const tipoCompleto = `${tipoEstudio} (${clasificacion})`;
        const data = await obtenerFrecuenciaPorProductoYTipo(productoIdSeleccionado, tipoCompleto);
        setFrecuenciaData(data);
      } catch (error) {
        console.error("Error al obtener frecuencia:", error);
        setFrecuenciaData(null);
      }
    };
    fetchFrecuencia();
  }, [productoIdSeleccionado, tipoEstudio, clasificacion]);


  const handleSeleccionarProducto = async (e) => {
    const nombre = e.target.value;
    const producto = productos.find(p => p.nombre === nombre);

    setProductoSeleccionado(nombre);
    setProductoIdSeleccionado(producto?.id || null);

    setVolumenNominal("");
    setFormulaTabla([]);

    try {
      const data = await obtenerDetalleProducto(nombre);
      setFormaFarmaceutica(data.formaFarmaceutica || "No asignada");
      setEnvasePrimario(data.envasePrimario || "");
      setVolumenes(data.volumenes || []);
      setFormulasPorVolumen(data.formulas || []);
      setEspecificaciones(data.especificaciones || []);

      if (data.volumenes.length > 0) {
        const primerVolumen = data.volumenes[0];
        const valueString = `${primerVolumen.cantidad} ${primerVolumen.unidad}`;
        setVolumenNominal(valueString);
        setVolumenCantidad(primerVolumen.cantidad);
        setVolumenUnidad(primerVolumen.unidad);

        const formulaInicial = data.formulas.find(f => f.volumen === valueString);
        setFormulaTabla(formulaInicial?.materiasPrimas || []);
      }

    } catch (error) {
      console.error("Error al obtener datos del producto:", error);
    }
  };


  const handleSeleccionarVolumen = (e) => {
    const vol = e.target.value;
    setVolumenNominal(vol);
    const partes = vol.split(" ");
    setVolumenCantidad(partes[0]);
    setVolumenUnidad(partes[1] || "ml");

    const formula = formulasPorVolumen.find(f => f.volumen === vol);
    setFormulaTabla(formula?.materiasPrimas || []);
  };

  const handleSeleccionarTipoEstudio = (e) => {
    const tipo = e.target.value;
    setTipoEstudio(tipo);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={2} px={2}>
        {/* Sección izquierda */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Determinación y Objetivo del Estudio
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2">Clasificación:</Typography>
                <Select fullWidth size="small" value={clasificacion} onChange={(e) => setClasificacion(e.target.value)} displayEmpty>
                  <MenuItem value="" disabled>Seleccione...</MenuItem>
                  <MenuItem value="ESTABLE">ESTABLE</MenuItem>
                  <MenuItem value="MENOS ESTABLE">MENOS ESTABLE</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2">Tipo de estudio:</Typography>
                <Select fullWidth size="small" value={tipoEstudio} onChange={handleSeleccionarTipoEstudio} displayEmpty disabled={!clasificacion}>
                  <MenuItem value="" disabled>Seleccione...</MenuItem>
                  {["ESTABILIDAD NATURAL", "ESTABILIDAD ACELERADA", "ESTABILIDAD ON GOING", "ESTUDIO DE EXCURSIÓN"].map((tipo, idx) => (
                    <MenuItem key={idx} value={tipo}>{tipo}</MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2">Objetivo:</Typography>
                <TextField fullWidth size="small" value={objetivo} onChange={(e) => setObjetivo(e.target.value)} />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2">Temperatura:</Typography>
                <Select fullWidth size="small" value={temperatura} onChange={(e) => setTemperatura(e.target.value)} displayEmpty>
                  <MenuItem value="" disabled>Seleccione...</MenuItem>
                  <MenuItem value="40°C ± 2°C">40°C ± 2°C</MenuItem>
                  <MenuItem value="30°C ± 2°C">30°C ± 2°C</MenuItem>
                  <MenuItem value="5°C ± 3°C">5°C ± 3°C</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2">Humedad:</Typography>
                <Select fullWidth size="small" value={humedad} onChange={(e) => setHumedad(e.target.value)} displayEmpty>
                  <MenuItem value="" disabled>Seleccione...</MenuItem>
                  <MenuItem value="No más de 25% H.R.">No más de 25% H.R.</MenuItem>
                  <MenuItem value="75% ± 5% H.R.">75% ± 5% H.R.</MenuItem>
                  <MenuItem value="60% ± 5% H.R.">60% ± 5% H.R.</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Paper>

          <DiseñoEstudio lotes={lotes} setLotes={setLotes} />
        </Grid>

        {/* Sección derecha */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Datos del Producto
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2">Nombre del producto:</Typography>
                <Autocomplete
                  fullWidth
                  size="small"
                  options={productos.map(p => p.nombre)}
                  value={productoSeleccionado}
                  onChange={(e, value) => {
                    if (value) {
                      handleSeleccionarProducto({ target: { value } });
                    } else {
                      // Al limpiar, reseteamos todo lo relacionado al producto
                      setProductoSeleccionado("");
                      setProductoIdSeleccionado(null);
                      setFormaFarmaceutica("");
                      setEnvasePrimario("");
                      setVolumenes([]);
                      setVolumenNominal("");
                      setVolumenCantidad("");
                      setVolumenUnidad("");
                      setFormulasPorVolumen([]);
                      setFormulaTabla([]);
                      setEspecificaciones([]);
                      setFrecuenciaData(null);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Seleccione o escriba..." />
                  )}
                  isOptionEqualToValue={(option, value) => option === value}
                />

              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Forma Farmacéutica:</Typography>
                <TextField fullWidth size="small" value={formaFarmaceutica} InputProps={{ readOnly: true, sx: { fontWeight: "bold" } }} />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Volumen nominal:</Typography>
                <Select
                  fullWidth
                  size="small"
                  value={volumenNominal}
                  onChange={handleSeleccionarVolumen}
                  displayEmpty
                >
                  <MenuItem value="" disabled>Seleccione...</MenuItem>
                  {volumenes.map((vol, i) => {
                    const label = `No menor a ${vol.cantidad} ${vol.unidad}`;
                    const value = `${vol.cantidad} ${vol.unidad}`;
                    return (
                      <MenuItem key={i} value={value}>
                        {label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>


              <Grid item xs={6}>
                <Typography variant="body2">Envase Primario:</Typography>
                <TextField fullWidth size="small" value={envasePrimario} InputProps={{ readOnly: true }} />
              </Grid>

              {formulaTabla.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" mt={2} fontWeight="bold">FÓRMULA CUALI-CUANTITATIVA</Typography>
                  <Typography variant="body2" fontWeight="bold" mt={1}>Cada envase contiene:</Typography>
                  <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6}><strong>MATERIA PRIMA</strong></Grid>
                      <Grid item xs={3}><strong>Cantidad</strong></Grid>
                      <Grid item xs={3}><strong>Unidad</strong></Grid>
                      {formulaTabla.map((item, idx) => (
                        <React.Fragment key={idx}>
                          <Grid item xs={6}>{item.materiaPrima}</Grid>
                          <Grid item xs={3}>{item.cantidad}</Grid>
                          <Grid item xs={3}>{item.unidad}</Grid>
                        </React.Fragment>
                      ))}
                    </Grid>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <EspecificacionesEvaluacion producto={productoSeleccionado} especificaciones={especificaciones} />

      {/* 🔁 NUEVA TABLA */}
      {tipoEstudio && productoIdSeleccionado && (
        <>
          <Typography variant="h6" mt={4} mb={1} fontWeight="bold">
            Tabla de Frecuencia de Muestreo para {productoSeleccionado} - {tipoEstudio} ({clasificacion})
          </Typography>
          <TablaFrecuenciaProducto
            productoId={productoIdSeleccionado}
            tipoEstudio={`${tipoEstudio} (${clasificacion})`}
          />
        </>
      )}



      <ProtocoloExportarPDF
        producto={productoSeleccionado}
        tipoEstudio={tipoEstudio}
        objetivo={objetivo}
        temperatura={temperatura}
        humedad={humedad}
        formaFarmaceutica={formaFarmaceutica}
        volumenCantidad={volumenCantidad}
        volumenUnidad={volumenUnidad}
        envasePrimario={envasePrimario}
        clasificacion={clasificacion}
        formulaTabla={formulaTabla}
        especificaciones={especificaciones}
        lotes={lotes}
        fecha={fechaActual}
        frecuencia={frecuenciaData}
      />
    </LocalizationProvider>
  );
};

export default ProtocoloForm;