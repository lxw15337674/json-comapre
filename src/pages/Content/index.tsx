import React, { useContext, useState } from 'react';
import JsonSpace from './JsonSpace';
import { Container } from './styled';
import Context from '@pages/state';
const Content = () => {
  const { state, dispatch } = useContext(Context);
  return (
    <Container>
      <JsonSpace
        value={state.sourceJson}
        compareValue={state.compareJson}
        setValue={(value) => dispatch({ type: 'setSourceJson', sourceJson: value })}
      ></JsonSpace>
      <JsonSpace
        value={state.compareJson}
        compareValue={state.sourceJson}
        setValue={(value) => dispatch({ type: 'setCompareJson', compareJson: value })}
      ></JsonSpace>
    </Container>
  );
};
export default Content;
