import { Options, Status, JsonValue, StatusObj } from '../interface';
import { isBaseType, include } from '../utils';
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

const arrayCompare = (array: JsonValue[], compareArray: JsonValue[]): Status[] => {
  let statusArray: Status[] = [];
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
    for (let value of array) {
      statusArray.push(include(value, compareArray) ? Status.eq : Status.add);
    }
    let length = compareArray.length - array.length;
    while (length > 0) {
      statusArray.push(Status.lack);
      length--;
    }
  }
  return statusArray;
};

//比对引用类型
const compare = (value: any, compareValue: any): any => {
  const type = dataType(value);
  const compareType = dataType(compareValue);
  if (type === compareType) {
    if (type === 'object') {
      return objCompare(value, compareValue);
    }
    if (type === 'array') {
      return arrayCompare(value, compareValue);
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
