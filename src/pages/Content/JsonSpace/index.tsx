import React, { ReactEventHandler, useMemo, useState } from 'react';
import { StyledContainer, StyledPre } from './styled';

interface Props {
  value: string;
  compareValue?: string;
  onInput: (value: string) => void;
}
const CodeContainer: React.FC<Props> = ({ value, compareValue, onInput }) => {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInput(e.target.innerText || '');
  };
  return (
    <StyledContainer>
      <StyledPre contentEditable='true' onInput={handleInput}></StyledPre>
    </StyledContainer>
  );
};
export default CodeContainer;
