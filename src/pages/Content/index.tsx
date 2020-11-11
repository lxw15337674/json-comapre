import React, { useState } from 'react';
import JsonSpace from './JsonSpace';
import { Container } from './styled';
const Content = () => {
  const [sourceJson, setSourceJson] = useState(
    '{"code":200,"result":{"count":0,"lastMessage":null,"needPolling":0,"dvcSwitch":0,"delay":15000},"message":"success","total":0}',
  );
  const [compareJson, setCompareJson] = useState('{"code":200}');
  return (
    <Container>
      <JsonSpace
        value={sourceJson}
        setValue={(value) => setSourceJson(value)}
        compareValue={compareJson}
      ></JsonSpace>
      <JsonSpace
        value={compareJson}
        setValue={(value) => setCompareJson(value)}
        compareValue={sourceJson}
      ></JsonSpace>
    </Container>
  );
};
export default Content;
