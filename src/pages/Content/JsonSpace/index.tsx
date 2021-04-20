import React, { useEffect, useMemo, useState } from 'react';
import { StyledContainer } from './styled';
import { Input } from 'antd';
import { isJSON } from '@/common/utils/utils';

const { TextArea } = Input;
interface Props {
  value: object;
  setValue: (value: React.SetStateAction<any>) => void;
}

const CodeContainer = ({ value, setValue }: Props) => {
  console.log(value);
  const [isJson, setIsJson] = useState(true);
  const text = useMemo(() => {
    if (value === null) {
      return null;
    }
    return JSON.stringify(value);
  }, [value]);
  const onInput = (e) => {
    debugger;
    const isJson = isJSON(e.target.value);
    if (isJson) {
      setValue(JSON.parse(e.target.value));
    } else {
      setValue(null);
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
