import {
  LineNumberObj,
  Options,
  Status,
  JsonValue,
  LineNumberValue,
  StatusObj,
} from '../interface';
import traversingStatus from '../traversingStatus';
import { computingMaxLineNumber, isBaseType, computingLineNumber, include } from '../utils';
import { dataType, serializeObject, extend } from '../utils';

// export const jsonCompare: JsonCompare = (obj, compareObj, options) => {
//   return objCompare(obj, compareObj);
// };

// 输出两个个值：
// diff结果对象
// 待格式化的完整对象

const objCompare = (obj: object, compareObj: object): [StatusObj, LineNumberObj] => {
  let statusObj: StatusObj = {};
  let lineObj: LineNumberObj = {};
  const array = serializeObject(extend(obj, compareObj));
  for (let [key, value] of array) {
    const compareValue = compareObj[key];
    if (value === undefined) {
      statusObj[key] = traversingStatus(compareValue, Status.lack);
      lineObj[key] = computingLineNumber(compareValue);
      continue;
    }
    if (compareValue === undefined) {
      statusObj[key] = traversingStatus(value, Status.add);
      lineObj[key] = computingLineNumber(value);
      continue;
    }
    if (isBaseType(value)) {
      if (isBaseType(compareValue)) {
        statusObj[key] = value === compareValue ? Status.eq : Status.diff;
        lineObj[key] = 1;
        continue;
      } else {
        statusObj[key] = Status.diff;
        lineObj[key] = computingLineNumber(compareValue);
        continue;
      }
    }
    if (isBaseType(compareValue)) {
      statusObj[key] = Status.diff;
      lineObj[key] = computingLineNumber(value);
      continue;
    } else {
      const res = compare(value, compareValue);
      statusObj[key] = res[0];
      lineObj[key] = res[1];
    }
  }
  return [statusObj, lineObj];
};

// todo 数组敏感处理
const arrayCompare = (
  array: JsonValue[],
  compareArray: JsonValue[],
  options: Options = { arrayOrderSensitive: false },
): [Status[], LineNumberValue[]] => {
  let statusArray: Status[] = [];
  let lineArray: LineNumberValue[] = [];
  // if (arrayOrderSensitive) {
  //     const length = array.length >= compareArray.length ? array.length : compareArray.length;
  //     for (let index = 0; index < length; index++) {
  //       if (array[index] === undefined) {
  //         textArray.push(compareArray[index]);
  //         diffArray.push(Status.lack);
  //         continue;
  //       }
  //       textArray.push(array[index]);
  //       if (compareArray === undefined) {
  //         diffArray.push(Status.add);
  //         continue;
  //       }
  //       if (eq(array[index], compareArray[index])) {
  //         diffArray.push(Status.eq);
  //       } else {
  //         diffArray.push(Status.diff);
  //       }
  //     }
  //   }
  for (let value of array) {
    statusArray.push(include(value, compareArray) ? Status.eq : Status.add);
    lineArray.push(computingLineNumber(value));
  }
  return [statusArray, lineArray];
};

//比对引用类型
const compare = (
  value: any,
  compareValue: any,
  options: Options = { arrayOrderSensitive: false },
): any => {
  const type = dataType(value);
  const compareType = dataType(compareValue);
  if (type === compareType) {
    if (type === 'object') {
      return objCompare(value, compareValue);
    }
    if (type === 'array') {
      return arrayCompare(value, compareValue);
    }
    console.error('错误类型', type, compareType);
    return [[], []];
  }
  return computingMaxLineNumber(value, compareValue);
};

export default objCompare;
