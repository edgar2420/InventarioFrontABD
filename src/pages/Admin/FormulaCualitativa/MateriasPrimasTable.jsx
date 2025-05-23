import React from "react";
import { Table } from "antd";

const MateriasPrimasTable = ({ materias }) => {
  const columns = [
    {
      title: "Materia Prima",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
    },
    {
      title: "Unidad",
      dataIndex: "unidad",
      key: "unidad",
    },
  ];

  return (
    <Table
      dataSource={materias}
      columns={columns}
      pagination={false}
      rowKey={(row, i) => `${row.nombre}-${i}`}
      size="small"
      bordered
    />
  );
};

export default MateriasPrimasTable;