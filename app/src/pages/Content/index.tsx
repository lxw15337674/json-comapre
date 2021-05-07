import React, { useContext } from 'react';
import JsonSpace from './JsonSpace';
import { Container, InputView } from './styled';
import Context from '@/pages/state';
import DiffOut from './DiffOut';
import { Types } from '@/pages/state/interface';
const Content = () => {
  const { state, dispatch } = useContext(Context);
  return (
    <Container>
      <InputView>
        <JsonSpace
          value={state.sourceJson}
          setValue={(value) => dispatch({ type: Types.SetSourceJson, sourceJson: value })}
        ></JsonSpace>
        <JsonSpace
          value={state.compareJson}
          setValue={(value) => {
            dispatch({ type: Types.SetCompareJson, compareJson: value });
          }}
        ></JsonSpace>
      </InputView>
      <DiffOut value={state.sourceJson} compareValue={state.compareJson}></DiffOut>
    </Container>
  );
};
export default Content;
