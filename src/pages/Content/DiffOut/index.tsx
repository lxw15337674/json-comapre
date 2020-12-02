import React, { useMemo, useState } from 'react';
import compare from './compare';
import { JsonContainer, LineStatus, NumberLineContainer, ViewLine } from './styled';
interface Props {
  value: string;
  compareValue?: string;
}
const DiffOut = ({ value, compareValue }: Props) => {
  const [isJson, setIsJson] = useState(true);

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
    <>
      {' '}
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
    </>
  );
};
export default DiffOut;
