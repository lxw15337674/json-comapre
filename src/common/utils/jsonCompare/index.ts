import { Options, Status, JsonValue, StatusObj } from '../interface';
import { isBaseType } from '../utils';
import { dataType, serializeObject, extend } from '../utils';

let arrayOrderSensitive = false;
// 输出两个个值：
// diff结果对象
// 待格式化的完整对象
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

const arrayCompare = (
  array: JsonValue[],
  compareArray: JsonValue[],
  ignoreList: number[] = [],
): any => {
  if (array.length === 0 && compareArray.length === 0) {
    return Status.eq;
  }
  let statusArray: any[] = [];
  if (arrayOrderSensitive) {
    for (let index in array) {
      statusArray.push(compare(array[index], compareArray[index]));
    }
    let length = compareArray.length - array.length;
    while (length > 0) {
      statusArray.push(Status.lack);
      length--;
    }
  } else {
    const ignoreList: number[] = [];
    for (let value of array) {
      //多维数组
      const type = dataType(value);
      if (type === 'array') {
        for (let index in compareArray) {
          const compareValue = compareArray[index];
          const compareValueType = dataType(compareValue);
          if (compareValueType === 'array') {
            statusArray.push(arrayCompare(value as JsonValue[], compareValue as JsonValue[]));
            continue;
          }
          if (compareArray.length - 1 === Number(index)) {
            statusArray.push(Status.add);
          }
        }
        continue;
      }
      const index = find(value, compareArray, ignoreList);
      if (index === -1) {
        statusArray.push(Status.add);
        continue;
      }
      statusArray.push(Status.eq);
      ignoreList.push(index);
    }
    let length = compareArray.length - array.length;
    while (length > 0) {
      statusArray.push(Status.lack);
      length--;
    }
  }
  return statusArray;
};

// 判断数组包含，位置不敏感!
const find = (value: any, array: any[], ignoreList: number[] = []): number => {
  for (let index = 0; index < array.length; index++) {
    if (ignoreList.includes(index)) {
      continue;
    }
    const compareValue = array[index];
    const result = compare(value, compareValue);
    if (result === Status.eq) {
      return index;
    }
  }
  return -1;
};

//比对引用类型
const compare = (value: any, compareValue: any): any => {
  const type = dataType(value);
  const compareType = dataType(compareValue);
  if (type === compareType) {
    if (type === 'object') {
      return objCompare(value as object, compareValue as object);
    }
    if (type === 'array') {
      return arrayCompare(value as JsonValue[], compareValue as JsonValue[]);
    }
    if (type === 'null') {
      return null;
    }
    if (!value) {
      return Status.lack;
    }
    if (!compareValue) {
      return Status.add;
    }
    return value === compareValue ? Status.eq : Status.diff;
  }
  return Status.diff;
};

export default (
  value: any,
  compareValue: any,
  options: Options = { arrayOrderSensitive: false },
) => {
  arrayOrderSensitive = options.arrayOrderSensitive;
  return compare(value, compareValue);
};
