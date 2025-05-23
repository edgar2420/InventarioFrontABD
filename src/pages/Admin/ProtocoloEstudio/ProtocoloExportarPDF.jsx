import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@mui/material";
import { FaFilePdf } from "react-icons/fa";
import logo from "../../../assets/laboratoriosabd.png";
import { crearProtocolo, obtenerCodigoProtocolo } from "../../../services/ProtocoloService";

const tiemposPorTipo = {
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

const ProtocoloExportarPDF = ({
  producto,
  tipoEstudio,
  objetivo,
  temperatura,
  humedad,
  formaFarmaceutica,
  volumenCantidad,
  volumenUnidad,
  envasePrimario,
  formulaTabla,
  especificaciones,
  clasificacion,
  frecuencia,
  lotes,
  principioActivo,
  clasificacionPrincipio,
  fecha
}) => {
  const exportarPDF = async () => {
    try {
      const { codigo } = await obtenerCodigoProtocolo();
      console.log("📦 FRECUENCIA QUE LLEGA AL PDF:", frecuencia);
      const doc = new jsPDF();
      const img = new Image();
      img.src = logo;

      const header = (pagina) => {
        doc.setDrawColor(0);
        doc.rect(10, 10, 190, 20);
        doc.line(42, 10, 42, 30);
        doc.line(150, 10, 150, 30);
        for (let i = 15; i < 30; i += 5) {
          doc.line(150, i, 200, i);
        }
        doc.addImage(img, "PNG", 12, 12, 28, 14);
        doc.setFontSize(10);
        doc.setFont(undefined, "bold");
        doc.text("PROTOCOLO DE ESTUDIO DE ESTABILIDAD", 96, 18, { align: "center" });
        doc.setFontSize(8);
        doc.setFont(undefined, "normal");
        doc.text("Ref: CC-MN-006", 175, 14);
        doc.text("Registro 1", 175, 19);
        doc.text("Versión 1", 175, 24);
        doc.text(`Pág. ${pagina} de 2`, 175, 29);
      };

      header(1);

      let y = 35;
      doc.setFontSize(9);
      doc.text(`1. Código de Protocolo: ${codigo}`, 12, y);
      y += 8;

      doc.setFillColor(0, 174, 239);
      doc.rect(10, y, 190, 6, "F");
      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      doc.text("1º DETERMINACIÓN Y OBJETIVO DEL ESTUDIO", 105, y + 4, { align: "center" });
      y += 10;

      doc.setFont(undefined, "normal");
      doc.setFontSize(9);
      doc.text(`2. Tipo de estudio: ${tipoEstudio}`, 12, y); y += 6;
      doc.text(`3. Objetivo: ${objetivo}`, 12, y); y += 6;
      doc.text("4. Condiciones de almacenamiento:", 12, y); y += 5;
      doc.text(`- Temperatura: ${temperatura}`, 17, y);
      doc.text(`- Humedad: ${humedad}`, 110, y); y += 10;

      doc.setFillColor(0, 174, 239);
      doc.rect(10, y, 190, 6, "F");
      doc.setFont(undefined, "bold");
      doc.text("2º DATOS DEL PRODUCTO", 105, y + 4, { align: "center" });
      y += 10;

      doc.setFont(undefined, "normal");
      doc.text("5. Laboratorio fabricante: Laboratorios ABD Ltda.", 12, y); y += 6;
      doc.text(`6. Nombre del producto: ${producto}`, 12, y); y += 6;
      doc.text("7. Sistema de envase y cierre:", 12, y); y += 6;
      doc.text(`7.1 Volumen nominal: ${volumenCantidad} ${volumenUnidad}`, 17, y); y += 6;
      doc.text(`7.2 Envase primario: ${envasePrimario}`, 17, y); y += 6;
      doc.text(`8. Forma farmacéutica: ${formaFarmaceutica}`, 12, y); y += 6;
      doc.text("9. Fórmula cuali-cuantitativa:", 12, y);

      autoTable(doc, {
        startY: y + 3,
        head: [["Cada envase contiene", "Cantidad"]],
        body: formulaTabla.map((f) => [f.materiaPrima, `${f.cantidad} ${f.unidad}`]),
        theme: "grid",
        styles: { fontSize: 8 },
        headStyles: { fillColor: [200, 200, 200] },
      });

      let yLotes = doc.lastAutoTable.finalY + 10;
      const materiasPrimas = formulaTabla.map(f => f.materiaPrima).join(", ");
      const clasificacionFinal = clasificacionPrincipio || (tipoEstudio.includes("ESTABLE") ? "ESTABLE" : "MENOS ESTABLE");

      const principioActivoTexto = `10. Principio Activo(s) (D.C.I.): ${principioActivo || materiasPrimas}`;
      const principioActivoLineas = doc.splitTextToSize(principioActivoTexto, 180);
      doc.text(principioActivoLineas, 12, yLotes);
      yLotes += principioActivoLineas.length * 5;

      doc.text(`10.1 Clasificación del Principio Activo(s): ${clasificacionFinal}`, 12, yLotes); yLotes += 6;

      doc.setFillColor(0, 174, 239);
      doc.rect(10, yLotes, 190, 6, "F");
      doc.setFont(undefined, "bold");
      doc.text("3º DISEÑO DEL ESTUDIO", 105, yLotes + 4, { align: "center" });
      yLotes += 10;

      doc.setFont(undefined, "normal");
      doc.text("11. Lotes a evaluar:", 12, yLotes); yLotes += 6;
      doc.text(`11.1 Fecha de ingreso al estudio: ${fecha}`, 17, yLotes); yLotes += 6;

      autoTable(doc, {
        startY: yLotes + 3,
        head: [["Nº de Lote", "Tamaño de lote", "Fecha de fabricación", "Tipo de lote", "Duración del estudio"]],
        body: lotes.map((l) => [l.numero, l.tamano, l.fecha, l.tipo, l.duracion]),
        theme: "grid",
        styles: { fontSize: 8 },
      });

      doc.addPage(); header(2);
      doc.setFont(undefined, "bold");
      doc.setFontSize(9);
      doc.text("12º ESPECIFICACIONES A EVALUAR Y CRITERIO DE ACEPTACIÓN", 12, 35);
      let ySpecs = 38;

      const transformarEspecificaciones = (data) => {
        const generales = [], valoraciones = [], microbiologicas = [];
        data.forEach((item) => {
          if (item.tipo === "especificacion") generales.push([item.nombre, item.criterio]);
          if (item.tipo === "valoracion") valoraciones.push([item.nombre, item.criterio]);
          if (item.tipo === "prueba_microbiologica") microbiologicas.push([item.nombre, item.criterio]);
        });
        return { generales, valoraciones, microbiologicas };
      };

      const renderGrupo = (titulo, filas, head = []) => {
        doc.setFillColor(179, 205, 224);
        doc.rect(10, ySpecs, 190, 6, "F");
        doc.setFont(undefined, "bold");
        doc.text(titulo, 105, ySpecs + 4, { align: "center" });
        ySpecs += 8;

        autoTable(doc, {
          startY: ySpecs,
          head: head.length ? [head] : [],
          body: filas,
          theme: "grid",
          styles: { fontSize: 8 },
          margin: { left: 10, right: 10 },
        });
        ySpecs = doc.lastAutoTable.finalY + 4;
      };

      const { generales, valoraciones, microbiologicas } = transformarEspecificaciones(especificaciones);
      if (generales.length) renderGrupo("Especificaciones", generales, ["Especificación", "Criterio de Aceptación"]);
      if (valoraciones.length) renderGrupo("Valoración", valoraciones);
      if (microbiologicas.length) renderGrupo("Pruebas microbiológicas", microbiologicas);

      doc.setFont(undefined, "bold");
      doc.text("13. Frecuencia de Muestreo y Cantidad de Muestras Ingresadas al Estudio", 12, ySpecs);
      doc.setFont(undefined, "normal");

// ⏱️ Obtener los tiempos correctos según el tipo de estudio
const tipoCompleto = `${tipoEstudio} (${clasificacion})`;

const tiempos = Object.keys(tiemposPorTipo[tipoCompleto] || {}).filter(t => t !== "").sort((a, b) => {
  const orden = ["T0", "T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "Extra"];
  return orden.indexOf(a) - orden.indexOf(b);
});

// 🧪 Parametros a mostrar en filas
const parametros = [
  { key: "aspecto", label: "Aspecto" },
  { key: "hermeticidad", label: "Hermeticidad" },
  { key: "ph", label: "pH" },
  { key: "valoracion", label: "Valoración" },
  { key: "particulas_visibles", label: "Partículas visibles" },
  { key: "pruebas_microbiologicas", label: "Pruebas microbiológicas" },
  { key: "rectificacion", label: "Rectificación" },
];

// 🧾 Encabezados
const encabezado = [
  "Especificación",
  "# de muestra (Env.)",
  ...tiempos.map(t => `${t} (${tiemposPorTipo[tipoCompleto][t]})`),
  "Sub-Total"
];

// 🧮 Cuerpo: duplicamos valores por cada tiempo
const cuerpo = parametros.map(({ key, label }) => {
  const cantidad = frecuencia?.[key] ?? 0;
  const valores = tiempos.map(() => cantidad); // Duplica como en el frontend
  const subtotal = valores.reduce((a, b) => a + b, 0);
  return [
    { content: label },
    { content: cantidad },
    ...valores.map(v => ({ content: v })),
    { content: subtotal }
  ];
});

// ➕ Fila: Muestras por tiempo (suma columnas)
const muestrasPorTiempo = tiempos.map((_, colIdx) =>
  cuerpo.reduce((sum, fila) => sum + (parseInt(fila[colIdx + 2]?.content) || 0), 0)
);
cuerpo.push([
  { content: "Muestras por tiempo:", colSpan: 2, styles: { fontStyle: 'bold', fillColor: [230, 230, 250] } },
  ...muestrasPorTiempo.map(v => ({ content: v, styles: { fontStyle: 'bold', fillColor: [230, 230, 250] } })),
  { content: "", styles: { fillColor: [230, 230, 250] } }
]);

// ➕ Fila: Total por lote
const totalLote = muestrasPorTiempo.reduce((a, b) => a + b, 0);
cuerpo.push([
  { content: "Total por lote:", colSpan: 2, styles: { fontStyle: 'bold', fillColor: [210, 210, 240] } },
  ...Array(tiempos.length).fill({ content: "", styles: { fillColor: [210, 210, 240] } }),
  { content: totalLote, styles: { fontStyle: 'bold', fillColor: [210, 210, 240] } }
]);

// 🖨️ Imprimir la tabla
autoTable(doc, {
  startY: ySpecs + 5,
  head: [encabezado],
  body: cuerpo,
  styles: {
    fontSize: 7,
    halign: 'center',
    valign: 'middle',
    cellPadding: 1.5,
  },
  headStyles: {
    fillColor: [180, 200, 230],
    textColor: 0,
    fontStyle: 'bold',
  },
  theme: "grid",
});

      const yFinal = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(9);
      doc.text("Observaciones:", 12, yFinal);
      doc.line(35, yFinal + 1, 200, yFinal + 1);
      doc.line(35, yFinal + 6, 200, yFinal + 6);

      doc.text("Realizado por:", 12, yFinal + 15);
      doc.line(40, yFinal + 15, 90, yFinal + 15);
      doc.text("Firma:", 12, yFinal + 22);
      doc.line(40, yFinal + 22, 90, yFinal + 22);

      doc.text("Verificado por:", 110, yFinal + 15);
      doc.line(140, yFinal + 15, 190, yFinal + 15);
      doc.text("Firma:", 110, yFinal + 22);
      doc.line(140, yFinal + 22, 190, yFinal + 22);

      doc.save(`Protocolo-${producto}.pdf`);

      await crearProtocolo({
        codigo,
        tipo_estudio: tipoEstudio,
        objetivo,
        temperatura,
        humedad,
        laboratorio_fabricante: "Laboratorios ABD Ltda.",
        producto_nombre: producto,
        sistema_envase: "Sistema no especificado",
        volumen_nominal: volumenUnidad ? `${volumenCantidad} ${volumenUnidad}` : `${volumenCantidad} ml`,
        envase_primario: envasePrimario,
        envase_secundario: "No definido",
        formula_cuali_cuantitativa: formulaTabla,
        principio_activo: principioActivo || materiasPrimas,
        clasificacion_principio: clasificacionFinal,
        fecha_ingreso: fecha,
        lotes,
        especificaciones,
        frecuencia_muestreo: frecuencia,
        observaciones: "",
        realizado_por: "",
        verificado_por: ""
      });
    } catch (error) {
      console.error("Error al exportar PDF o guardar protocolo:", error);
    }
  };

  return (
    <Button
      variant="contained"
      color="error"
      startIcon={<FaFilePdf />}
      onClick={exportarPDF}
      sx={{ mt: 3 }}
    >
      Exportar PDF
    </Button>
  );
};

export default ProtocoloExportarPDF;
