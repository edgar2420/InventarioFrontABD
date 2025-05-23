import React, { useState } from "react";
import { Modal, Form, Select, Input, Button, Space } from "antd";

const FormulaFormModal = ({
  visible,
  onCancel,
  onOk,
  productos,
  form,
  setVolumenDesdeProducto,
}) => {
  const [volumenesDelProducto, setVolumenesDelProducto] = useState([]);

  const handleSeleccionarProducto = (nombreProducto) => {
    const seleccionado = productos.find(p => p.nombre === nombreProducto);
    if (seleccionado) {
      const volumenes = seleccionado.volumenes || [];
      setVolumenesDelProducto(volumenes);
      form.setFieldsValue({ volumenNominal: "" }); // Reiniciar volumen
    }
  };

  const handleSeleccionarVolumen = (valor) => {
    form.setFieldsValue({ volumenNominal: valor });
    if (setVolumenDesdeProducto) setVolumenDesdeProducto(valor);
  };

  return (
    <Modal
      title="Crear Nueva Fórmula"
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      okText="Guardar"
      cancelText="Cancelar"
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Producto"
          name="productoNombre"
          rules={[{ required: true, message: "El producto es obligatorio" }]}
        >
          <Select
            showSearch
            placeholder="Seleccionar producto"
            onChange={handleSeleccionarProducto}
            options={productos.map(p => ({
              value: p.nombre,
              label: p.nombre
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Volumen Nominal"
          name="volumenNominal"
          rules={[{ required: true, message: "El volumen es obligatorio" }]}
        >
          <Select
            placeholder="Selecciona un volumen"
            disabled={volumenesDelProducto.length === 0}
            onChange={handleSeleccionarVolumen}
            options={volumenesDelProducto.map(v => ({
              value: `${v.cantidad} ${v.unidad}`,
              label: `No menor a ${v.cantidad} ${v.unidad}`
            }))}
          />
        </Form.Item>

        {/* 🧪 Materias Primas con Form.List */}
        <Form.List name="materiasPrimas">
          {(fields, { add, remove }) => (
            <>
              <label><strong>Materias Primas:</strong></label>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'nombre']}
                    rules={[{ required: true, message: 'Nombre requerido' }]}
                  >
                    <Input placeholder="Nombre" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'cantidad']}
                    rules={[{ required: true, message: 'Cantidad requerida' }]}
                  >
                    <Input placeholder="Cantidad" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'unidad']}
                    rules={[{ required: true, message: 'Unidad requerida' }]}
                  >
                    <Input placeholder="Unidad" />
                  </Form.Item>
                  <Button danger type="text" onClick={() => remove(name)}>
                    Eliminar
                  </Button>
                </Space>
              ))}
              <Button type="dashed" onClick={() => add()} block>
                + Agregar materia prima
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

FormulaFormModal.useForm = Form.useForm;

export default FormulaFormModal;
