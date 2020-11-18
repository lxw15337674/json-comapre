import React, { useState } from 'react';
import JsonSpace from './JsonSpace';
import { Container } from './styled';
const Content = () => {
  const [sourceJson, setSourceJson] = useState(
    `{
      "a":[
        12,
        3]
    }`,
  );
  const [compareJson, setCompareJson] = useState<string>(
    `{
      "a":[
        33,
        3]
    }`,
  );
  return (
    <Container>
      <JsonSpace
        value={sourceJson}
        compareValue={compareJson}
        setValue={(value) => setSourceJson(value)}
      ></JsonSpace>
      <JsonSpace
        value={compareJson}
        compareValue={sourceJson}
        setValue={(value) => setCompareJson(value)}
      ></JsonSpace>
    </Container>
  );
};
export default Content;
