import React, { useState } from "react";
import { Slider, Button, Form } from "antd";
import styled from "styled-components";

const Container = styled.div`
  padding: 10px;
`;

const Filter = ({ schools, changeMaxDistance, maxDistance }) => {
  const [value, setValue] = useState(maxDistance);

  if (!schools) return null;

  return (
    <Container>
      <Form.Item label={`Maximum afstand: ${maxDistance} meter`}>
        <Slider
          min={0}
          max={20000}
          step={500}
          onChange={e => {
            setValue(e);
          }}
          value={value}
        />
      </Form.Item>{" "}
      {value !== maxDistance ? (
        <Button onClick={() => changeMaxDistance(value)}>Toepassen</Button>
      ) : null}
    </Container>
  );
};

export default Filter;
