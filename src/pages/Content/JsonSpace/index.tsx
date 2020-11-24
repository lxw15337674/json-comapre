import React, { useMemo, useState } from 'react';
import {
  HalfHightDiv,
  JsonContainer,
  LineStatus,
  NumberLineContainer,
  StyledContainer,
  StyledInputDiv,
  ViewLine,
} from './styled';
import { Input } from 'antd';
import compare from './compare';
const { TextArea } = Input;
interface Props {
  value: string;
  compareValue?: string;
  setValue: (value: React.SetStateAction<string>) => void;
}

const CodeContainer = ({ value, compareValue, setValue }: Props) => {
  const [isJson, setIsJson] = useState(true);
  const onInput = (e) => {
    setValue(e.target.value);
  };
  const [keyWords, setKeyWords] = useState('');
  const sourceObj = useMemo((): object => {
    let result = {};
    try {
      result = JSON.parse(value);
      setIsJson(true);
      return result;
    } catch (e) {
      setIsJson(false);
      return result;
    }
  }, [value, isJson]);
  const compareObj = useMemo((): object => {
    if (!isJson) {
      return {};
    }
    try {
      return JSON.parse(compareValue);
    } catch (e) {
      return {};
    }
  }, [compareValue, isJson]);
  const [comparedJson, lineResult] = useMemo(() => {
    return compare(sourceObj, compareObj);
  }, [sourceObj, compareObj]);
  return (
    <StyledContainer isJson={isJson}>
      <HalfHightDiv>
        <NumberLineContainer>
          {lineResult.map((status, index) => {
            return (
              <LineStatus status={status} key={index}>
                {index}
                {status}
              </LineStatus>
            );
          })}
        </NumberLineContainer>
        <JsonContainer>
          {comparedJson.map((item, index) => {
            return (
              <ViewLine status={lineResult[index]} key={index}>
                {item}
              </ViewLine>
            );
          })}
        </JsonContainer>
      </HalfHightDiv>
      <StyledInputDiv>
        <Input value={keyWords} onChange={(e) => setKeyWords(e.target.value)}></Input>
      </StyledInputDiv>
      <TextArea value={value} onChange={onInput}></TextArea>
    </StyledContainer>
  );
};
export default CodeContainer;
