import React, { useState } from "react";
import styled from "styled-components";
import { Table } from "antd";
import "antd/dist/antd.css";

const List = ({ schools, setHighlighted }) => {
  const [sortedInfo, setSortedInfo] = useState({});

  const Container = styled.div`
    overflow: auto;
  `;

  const numberSorter = field => {
    return (a, b) => (a[field] === b[field] ? 0 : a[field] < b[field] ? -1 : 1);
  };

  const columns = [
    {
      title: "Naam",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => {
        if (a.name.toLowerCase() === b.name.toLowerCase()) {
          return 0;
        }
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        }
        return 1;
      }
    },
    {
      title: "Indicator",
      dataIndex: "indicator",
      key: "indicator",
      sorter: numberSorter("indicator")
    },
    {
      title: "N-indicator",
      dataIndex: "notIndicator",
      key: "notIndicator",
      sorter: numberSorter("notIndicator")
    },
    {
      title: "Afstand",
      dataIndex: "distance",
      key: "distance",
      render: text => (text ? `${text}m` : null),
      sorter: numberSorter("distance")
    },
    {
      title: "",
      dataIndex: "show",
      key: "show",
      render: (text, record) => {
        return (
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              setHighlighted(record);
            }}
          >
            toon
          </a>
        );
      }
    }
  ];

  return (
    <Container>
      <Table
        dataSource={schools}
        rowKey={"name"}
        columns={columns}
        pagination={false}
        scroll={true}
      />
    </Container>
  );
};

export default List;
