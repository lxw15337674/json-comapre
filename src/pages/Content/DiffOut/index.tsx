import { Status } from '@/common/utils/interface';
import { dataType, serializeObject } from '@/common/utils/utils';
import React, { useMemo } from 'react';
import compare from '../../../common/utils/jsonCompare';
import DiffLines from './DiffLines';
import LineNumberLines from './LineNumberLines';
interface Props {
  value: object;
  compareValue: object;
}

const serialize = (statusObj, lineNumberObj, sourceObj) => {
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
        }),
      );
      continue;
    }
    result.push(...serialize(statusObj[key], lineNumberObj[key], sourceObj[key]));
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
  const resultLines = useMemo(() => {
    console.log(compare(value, compareValue));
    for (let fn of serialize(...compare(value, compareValue), value)) {
      fn((key, value, index, status) => {
        console.log(key, value, index, status);
      });
    }
    return serialize(...compare(value, compareValue), value);
  }, [value, compareValue]);
  return (
    <>
      <LineNumberLines data={resultLines} />
      <DiffLines data={value} />
    </>
  );
};
export default DiffOut;
