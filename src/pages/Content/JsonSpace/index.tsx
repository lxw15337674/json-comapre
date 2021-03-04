import React, { useState } from 'react';
import { StyledContainer } from './styled';
import { Input } from 'antd';
import { isJSON } from '@/common/utils/utils';

const { TextArea } = Input;
interface Props {
  value: object;
  setValue: (value: React.SetStateAction<object>) => void;
}

const CodeContainer = ({ value, setValue }: Props) => {
  const [isJson, setIsJson] = useState(true);
  const [text, setText] = useState(JSON.stringify(value));
  const onInput = (e) => {
    setText(e.target.value);
    const isJson = isJSON(e.target.value);
    if (isJson) {
      setValue(JSON.parse(e.target.value));
    } else {
      setValue({});
    }
    setIsJson(isJson);
  };

  return (
    <StyledContainer isJson={isJson}>
      <TextArea value={text} onChange={onInput}></TextArea>
    </StyledContainer>
  );
};
export default CodeContainer;
