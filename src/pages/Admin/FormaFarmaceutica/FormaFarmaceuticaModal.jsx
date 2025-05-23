import React from "react";
import { Modal, Form, Input } from "antd";

const FormaFarmaceuticaModal = ({ visible, onCancel, onOk, form }) => {
  return (
    <Modal
      title="Forma Farmacéutica"
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      okText="Guardar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="nombre"
          label="Nombre"
          rules={[{ required: true, message: "Ingrese el nombre de la forma farmacéutica" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormaFarmaceuticaModal;
