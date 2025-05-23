import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button } from 'antd';
import { obtenerFormasFarmaceuticas } from '../../services/FormaFarmaceuticaSevice';

const ProductoFormModal = ({
  visible,
  onCancel,
  onOk,
  form,
  isEdit,
  productoSeleccionado
}) => {
  const [formasFarmaceuticas, setFormasFarmaceuticas] = useState([]);

  useEffect(() => {
    if (visible) {
      obtenerFormasFarmaceuticas()
        .then(data => setFormasFarmaceuticas(data))
        .catch(err => console.error(err));  
    }
  }, [visible]);

  useEffect(() => {
    if (visible && isEdit && productoSeleccionado) {
      form.setFieldsValue({
        ...productoSeleccionado,
        formaFarmaceuticaNombre: productoSeleccionado.formaFarmaceutica?.nombre || "",
        phMin: productoSeleccionado.phMin,
        phMax: productoSeleccionado.phMax,
        recuentoMicrobianoMin: productoSeleccionado.recuentoMicrobianoMin,
        recuentoMicrobianoMax: productoSeleccionado.recuentoMicrobianoMax,
        volumenes: productoSeleccionado.volumenes || []
      });
    }
  }, [visible, isEdit, productoSeleccionado, form]);

  useEffect(() => {
    if (!visible || (visible && !isEdit)) {
      setTimeout(() => form.resetFields(), 0);
    }
  }, [visible, isEdit, form]);

  return (
    <Modal
      title={isEdit ? "Editar Producto" : "Crear Producto"}
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      okText="Guardar"
      cancelText="Cancelar"
      width={700}
    >
      <Form layout="vertical" form={form}>
        <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
          <Input placeholder="Ej: Solución R.A Ácida" />
        </Form.Item>

        <Form.Item name="formaFarmaceuticaNombre" label="Forma Farmacéutica" rules={[{ required: true }]}>
          <Select placeholder="Selecciona una forma farmacéutica">
            {formasFarmaceuticas.map(f => (
              <Select.Option key={f.id} value={f.nombre}>
                {f.nombre}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="lote" label="Lote">
          <Input placeholder="Ej: A23-BD-001" />
        </Form.Item>

        <Form.Item name="envase" label="Envase">
          <Input placeholder="Ej: Ampolla de vidrio ámbar" />
        </Form.Item>

        {/* 🔁 Volúmenes dinámicos estilo lista */}
        <Form.List name="volumenes">
          {(fields, { add, remove }) => (
            <>
              <label><strong>Volúmenes</strong></label>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                  <Form.Item
                    {...restField}
                    name={[name, 'cantidad']}
                    rules={[{ required: true, message: 'Cantidad requerida' }]}
                  >
                    <InputNumber placeholder="Cantidad" min={0} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'unidad']}
                    rules={[{ required: true, message: 'Unidad requerida' }]}
                  >
                    <Select placeholder="Unidad" style={{ width: 100 }}>
                      <Select.Option value="ml">ml</Select.Option>
                      <Select.Option value="L">L</Select.Option>
                    </Select>
                  </Form.Item>
                  <Button danger onClick={() => remove(name)}>Eliminar</Button>
                </div>
              ))}
              <Button type="dashed" onClick={() => add()} block>
                + Agregar volumen
              </Button>
            </>
          )}
        </Form.List>

        <Form.Item name="hermeticidad" label="Hermeticidad">
          <Input placeholder="Ej: Cierre hermético tipo twist-off" />
        </Form.Item>

        <Form.Item name="aspecto" label="Aspecto">
          <Input placeholder="Ej: Líquido claro, incoloro" />
        </Form.Item>

        <Form.Item name="phMin" label="pH mínimo">
          <InputNumber style={{ width: '100%' }} placeholder="Ej: 5.0" />
        </Form.Item>

        <Form.Item name="phMax" label="pH máximo">
          <InputNumber style={{ width: '100%' }} placeholder="Ej: 7.0" />
        </Form.Item>

        <Form.Item name="conductividad" label="Conductividad">
          <Input placeholder="Ej: Mayor a 222 ms/cm" />
        </Form.Item>

        <Form.Item name="impurezas" label="Impurezas">
          <Input placeholder="Ej: Sin impurezas visibles" />
        </Form.Item>

        <Form.Item name="particulas" label="Partículas">
          <InputNumber style={{ width: '100%' }} placeholder="Ej: 12" />
        </Form.Item>

        <Form.Item name="recuentoMicrobianoMin" label="Recuento Microbiano Mínimo">
          <InputNumber style={{ width: '100%' }} placeholder="Ej: 0" />
        </Form.Item>

        <Form.Item name="recuentoMicrobianoMax" label="Recuento Microbiano Máximo">
          <InputNumber style={{ width: '100%' }} placeholder="Ej: 100" />
        </Form.Item>

        <Form.Item name="referenciaDocumental" label="Referencia Documental">
          <Input placeholder="Ej: USP 42 / Farmacopea Europea 10.0" />
        </Form.Item>

        <Form.Item name="esterilidad" label="Esterilidad">
          <Input placeholder="Ej: Cumple requisitos de esterilidad" />
        </Form.Item>

        <Form.Item name="endotoxinas" label="Endotoxinas">
          <Input placeholder="Ej: < 0.25 EU/ml" />
        </Form.Item>

        <Form.Item name="observaciones" label="Observaciones">
          <Input.TextArea rows={2} placeholder="Ej: Producto de uso oftálmico, no ingerir." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

ProductoFormModal.useForm = Form.useForm;

export default ProductoFormModal;

