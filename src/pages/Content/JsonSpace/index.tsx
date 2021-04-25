import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyledContainer } from './styled';
import { Input } from 'antd';
import { isJSON } from '@/common/utils/utils';

const { TextArea } = Input;
interface Props {
  value: string;
  setValue: (value: React.SetStateAction<any>) => void;
}

const CodeContainer = ({ value, setValue }: Props) => {
  const isJsonStatus = useMemo(() => {
    return isJSON(value);
  }, [value]);

  const onChange = (e) => {
    const value = e.target.value;
    setValue(value);
  };

  return (
    <StyledContainer isJson={isJsonStatus}>
      <TextArea value={value} onChange={onChange}></TextArea>
    </StyledContainer>
  );
};
export default CodeContainer;
