import React, { useEffect } from 'react';
import { Modal, Form, Select, InputNumber } from 'antd';

const FrecuenciaFormModal = ({ visible, onCancel, onOk, productos, frecuenciaInicial }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!visible) return;

    if (frecuenciaInicial) {
      form.setFieldsValue({
        productoId: frecuenciaInicial.productoId,
        ph: frecuenciaInicial.ph,
        valoracion: frecuenciaInicial.valoracion,
        particulas_visibles: frecuenciaInicial.particulas_visibles,
        pruebas_microbiologicas: frecuenciaInicial.pruebas_microbiologicas,
        rectificacion: frecuenciaInicial.rectificacion,
        aspecto: frecuenciaInicial.aspecto,
        hermeticidad: frecuenciaInicial.hermeticidad,
      });
    } else {
      form.resetFields();
    }
  }, [frecuenciaInicial, visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const frecuencia = {
        T0: 0, T1: 0, T2: 0, T3: 0, T4: 0,
        T5: 0, T6: 0, T7: 0, T8: 0, T9: 0,
        Extra: 0,
      };

      const data = {
        productoId: values.productoId,
        ph: values.ph,
        valoracion: values.valoracion,
        particulas_visibles: values.particulas_visibles,
        pruebas_microbiologicas: values.pruebas_microbiologicas,
        rectificacion: values.rectificacion,
        aspecto: values.aspecto,
        hermeticidad: values.hermeticidad,
        frecuencia,
      };

      onOk(data);
    } catch (err) {
      console.error("❌ Error en validación de formulario:", err);
    }
  };

  return (
    <Modal
      open={visible}
      title={frecuenciaInicial ? "Editar Frecuencia" : "Crear Frecuencia"}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleSubmit}
      okText="Guardar"
      cancelText="Cancelar"
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="productoId"
          label="Producto"
          rules={[{ required: true, message: "Selecciona un producto" }]}
        >
          <Select
            placeholder="Selecciona un producto"
            showSearch
            optionFilterProp="children"
          >
            {productos.map((p) => (
              <Select.Option key={p.id} value={p.id}>
                {p.nombre}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="ph" label="pH">
          <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="valoracion" label="Valoración">
          <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="particulas_visibles" label="Partículas visibles">
          <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="pruebas_microbiologicas" label="Pruebas microbiológicas">
          <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="rectificacion" label="Rectificación">
          <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="aspecto" label="Aspecto">
          <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="hermeticidad" label="Hermeticidad">
          <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FrecuenciaFormModal;
