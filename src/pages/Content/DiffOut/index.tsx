import { Status } from '@/common/utils/interface';
import oppositeStatus from '@/common/utils/oppositeStatus';
import { dataType, serializeObject } from '@/common/utils/utils';
import React, { useMemo } from 'react';
import compare from '../../../common/utils/jsonCompare';
import formatToJSON from './formatToJSON';
import LineNumberLines from './LineNumberLines';
import { JsonContainer, ViewLine } from './styled';
interface Props {
  value: object;
  compareValue: object;
}

const serialize = (statusObj, lineNumberObj, sourceObj, compareObj) => {
  let result = [];
  result.push((fn) =>
    fn({
      status: Status.eq,
      value: undefined,
    }),
  );
  for (let [key, value, index] of serializeObject(lineNumberObj)) {
    const type = dataType(value);
    if (type === 'number') {
      // 传入key，该key所占行数，key的位置，key的diff状态,value的值
      result.push((fn) =>
        fn({
          key,
          lineNumber: value,
          index,
          status: statusObj[key],
          value: sourceObj?.[key] ?? undefined,
          compareValue: compareObj?.[key] ?? undefined,
        }),
      );
      continue;
    }
    result.push(
      ...serialize(
        statusObj[key],
        lineNumberObj[key],
        sourceObj?.[key] ?? undefined,
        compareObj?.[key] ?? undefined,
      ),
    );
  }
  result.push((fn) =>
    fn({
      status: Status.eq,
      value: undefined,
    }),
  );
  return result;
};
const DiffOut = ({ value, compareValue }: Props) => {
  const diffResult = useMemo(() => {
    return compare(value, compareValue)[0];
  }, [value, compareValue]);
  return (
    <>
      {/* <LineNumberLines data={serialize(...compare(value, compareValue), value, compareValue)} /> } */}
      <JsonContainer>
        {formatToJSON(diffResult, value, compareValue).map(([status, text], index) => {
          return (
            <ViewLine status={status} key={index}>
              {text}
            </ViewLine>
          );
        })}
      </JsonContainer>
      {/* <LineNumberLines data={serialize(...compare(value, compareValue), value, compareValue)} /> */}
      <JsonContainer>
        {formatToJSON(diffResult, compareValue,value, true).map(([status, text], index) => {
          return (
            <ViewLine status={status} key={index}>
              {text}
            </ViewLine>
          );
        })}
      </JsonContainer>
    </>
  );
};
export default DiffOut;
