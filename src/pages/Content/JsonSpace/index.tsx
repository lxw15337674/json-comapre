import React, { useState } from 'react';
import { StyledContainer } from './styled';
import { Input } from 'antd';
import { isJSON } from '@/common/utils/utils';

const { TextArea } = Input;
interface Props {
  value: string;
  setValue: (value: React.SetStateAction<string>) => void;
}

const CodeContainer = ({ value, setValue }: Props) => {
  const [isJson, setIsJson] = useState(true);
  const onInput = (e) => {
    setIsJson(isJSON(e.target.value));
    if (isJson) {
      setValue(e.target.value);
    } else {
      setValue('');
    }
  };
  return (
    <StyledContainer isJson={isJson}>
      <TextArea defaultValue={value} onChange={onInput}></TextArea>
    </StyledContainer>
  );
};
export default CodeContainer;
