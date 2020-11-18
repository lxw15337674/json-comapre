import React, { useMemo, useState } from 'react';
import {
  HalfHightDiv,
  JsonContainer,
  LineStatus,
  NumberLine,
  NumberLineContainer,
  StyledContainer,
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
  const sourceObj = useMemo((): object => {
    let result = {};
    try {
      result = JSON.parse(value);
      setIsJson(true);
      return result;
    } catch (e) {
      console.log(e);
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
      console.log(e);
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
          {lineResult.map((item, index) => {
            return (
              <LineStatus key={index}>
                {index}
                {item}
              </LineStatus>
            );
          })}
        </NumberLineContainer>
        <JsonContainer>
          {comparedJson.map((item, index) => {
            return (
              <div key={index}>
                <span>{item}</span>
              </div>
            );
          })}
        </JsonContainer>
      </HalfHightDiv>
      <TextArea value={value} onChange={onInput}></TextArea>
    </StyledContainer>
  );
};
export default CodeContainer;
