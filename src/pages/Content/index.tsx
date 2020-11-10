import React, { useState } from 'react';
import JsonSpace from './JsonSpace';
import { Container } from './styled';
const Content = () => {
  const [sourceJson, setSourceJson] = useState('');
  return (
    <Container>
      <JsonSpace value={sourceJson} onInput={(value) => setSourceJson(value)}></JsonSpace>
      <JsonSpace value={sourceJson} onInput={(value) => setSourceJson(value)}></JsonSpace>
    </Container>
  );
};
export default Content;
