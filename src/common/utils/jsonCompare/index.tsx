import {
  Options,
  Status,
  JsonValue,
  StatusObj,
} from '../interface';
import {isBaseType,  include } from '../utils';
import { dataType, serializeObject, extend } from '../utils';

// export const jsonCompare: JsonCompare = (obj, compareObj, options) => {
//   return objCompare(obj, compareObj);
// };

// 输出两个个值：
// diff结果对象
// 待格式化的完整对象
// todo 缺少数组item lack的情况
const objCompare = (obj: object, compareObj: object): StatusObj => {
  let statusObj: StatusObj = {};
  const array = serializeObject(extend(obj, compareObj));
  for (let [key, value] of array) {
    const compareValue = compareObj[key];
    if (value === undefined) {
      statusObj[key] = Status.lack;
      continue;
    }
    if (compareValue === undefined) {
      statusObj[key] = Status.add;
      continue;
    }
    if (isBaseType(value)) {
      if (isBaseType(compareValue)) {
        statusObj[key] = value === compareValue ? Status.eq : Status.diff;
        continue;
      } else {
        statusObj[key] = Status.diff;
        continue;
      }
    }
    if (isBaseType(compareValue)) {
      statusObj[key] = Status.diff;
      continue;
    } else {
      statusObj[key] = compare(value, compareValue);
    }
  }
  return statusObj;
};

// todo 数组敏感处理
const arrayCompare = (
  array: JsonValue[],
  compareArray: JsonValue[],
  options: Options = { arrayOrderSensitive: false },
): Status[] => {
  let statusArray: Status[] = [];
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
  }
  let length = compareArray.length-array.length
  while(length>0){
    statusArray.push(Status.lack)
    length--
  }
  return statusArray;
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
    return []
  }
  return Status.diff;
};

export default compare;
