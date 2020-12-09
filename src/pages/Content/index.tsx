import React, { useContext, useState } from 'react';
import JsonSpace from './JsonSpace';
import { Container, InputView } from './styled';
import Context from '@pages/state';
import DiffOut from './DiffOut';
const Content = () => {
  const { state, dispatch } = useContext(Context);
  return (
    <Container>
      <InputView>
        <JsonSpace
          value={state.sourceJson}
          setValue={(value) => dispatch({ type: 'setSourceJson', sourceJson: value })}
        ></JsonSpace>
        <JsonSpace
          value={state.compareJson}
          setValue={(value) => dispatch({ type: 'setCompareJson', compareJson: value })}
        ></JsonSpace>
      </InputView>
      <DiffOut value={state.sourceJson} compareValue={state.compareJson}></DiffOut>
      <DiffOut compareValue={state.sourceJson} value={state.compareJson}></DiffOut>
    </Container>
  );
};
export default Content;
