import React, { useEffect, useMemo, useState } from 'react';
import { StyledContainer } from './styled';
import { Input } from 'antd';
import { isJSON } from '@/common/utils/utils';

const { TextArea } = Input;
interface Props {
  value: string;
  setValue: (value: React.SetStateAction<any>) => void;
}

const CodeContainer = ({ value, setValue }: Props) => {
  const [text, setText] = useState<string>('');
  const isJsonStatus = useMemo(() => {
    return isJSON(text);
  }, [text]);

  const formatText = useMemo(() => {
    if (text === '') {
      return null;
    }
    if (isJsonStatus) {
      return JSON.stringify(JSON.parse(text), null, 2);
    }
    return text;
  }, [text, isJsonStatus]);
  useEffect(() => {
    if (value !== null) {
      setText(JSON.stringify(value));
    }
  }, [value]);
  const onInput = (e) => {
    const isJson = isJSON(e.target.value);
    if (isJson) {
      setValue(JSON.parse(e.target.value));
    } else {
      setText(e.target.value);
      setValue(null);
    }
  };

  return (
    <StyledContainer isJson={isJsonStatus}>
      <TextArea value={formatText} onChange={onInput}></TextArea>
    </StyledContainer>
  );
};
export default CodeContainer;
