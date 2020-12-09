import {
  BasicType,
  JsonValue,
  LineNumberObj,
  LineNumberValue,
  Status,
  StatusObj,
} from './interface';
import traversingStatus from './traversingStatus';

/* eslint-disable no-unused-vars */
export function isObject(value) {
  return dataType(value) === 'object';
}
export function isBaseType(value) {
  const type = dataType(value);
  return type !== 'object' && type !== 'array';
}
// 数组不敏感的追加合并。
// 例如：
//  {
//   a: [1, 2, 3],
//   c:1
// };
//  {
//   a: [4, 3, 5],
//   b: 2,
//   c:3
// };
// 得到
//  {
//   a: [1, 2, 3, 4, 5],
//   b: null,
//   c:1
// };
export const extend = (sourceObj, compareObj) => {
  let obj = JSON.parse(JSON.stringify(sourceObj));
  for (const key in compareObj) {
    if (obj.hasOwnProperty(key)) {
      if (isObject(obj[key])) {
        obj[key] = extend(obj[key], compareObj[key]);
      }
      // if (concatArray && Array.isArray(obj[key])) {
      //   obj[key] = Array.from(new Set([...obj[key], compareObj[key]]));
      // }
    } else {
      obj[key] = undefined;
    }
  }
  return obj;
};

// 数组合并
export const arrayExtend = (array: any[], compareArray: any[]): any[] => {
  return Array.from(new Set([...array, ...compareArray]));
};

// 设置对象value值
export const setObjValue = (sourceObj, value) => {
  let obj = { ...sourceObj };
  for (let key in obj) {
    if (isObject(obj[key])) {
      setObjValue(obj[key], value);
    } else {
      obj[key] = value;
    }
  }
  return obj;
};
// 字符串循环
export const stringLoop = (str: string, num: number): string => {
  return num > 1 ? (str += stringLoop(str, --num)) : str;
};

export const dataType = (val: any): string => {
  return Object.prototype.toString.call(val).replace(/^.{8}(.+)]$/, (m, $1) => $1.toLowerCase());
};

// 循环对象
type Item = [string, any, number];
export const serializeObject = (obj: Object): Item[] => {
  let list: Item[] = [];
  let index = 0;
  for (let key in obj) {
    list.push([key, obj[key], index]);
    index++;
  }
  return list;
};

// 判断是否为json
export const isJSON = (str: string): boolean => {
  try {
    var obj = JSON.parse(str);
    if (typeof obj === 'object' && obj) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error('error：' + str + '!!!' + e);
    return false;
  }
};

// 判断两个变量是否相同
//TODO 待优化
export const eq = (val: any, compareVal: any): boolean => {
  if (dataType(val) !== dataType(compareVal)) {
    return false;
  }
  return JSON.stringify(val) === JSON.stringify(compareVal);
};

// 判断数组是否包含
export const arrayEq = (array: any[], compareVal: any): boolean => {
  for (let item of array) {
    if (eq(item, compareVal)) {
      return true;
    }
  }
  return false;
};

// 数组比较
// 区分位置是否敏感，比对状态分为四种：eq、diff、add、lack
// export enum Status {
//   add = '+',
//   lack = '-',
//   diff = 'D',
//   eq = '=',
// }

// export const arrayCompare = (
//   array: any[],
//   compareArray: any[],
//   arrayOrderSensitive = false,
// ): [any[], Status[]] => {
//   let textArray: any[] = [];
//   let diffArray: Status[] = [];
//   if (arrayOrderSensitive) {
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
//   } else {
//     // let _compareArray = [...compareArray];
//     // todo:如果位置不敏感，数组元素重复怎么处理?
//     for (let item of array) {
//       stateArray.push(item);
//       if (arrayEq(compareArray, item)) {
//         resultArray.push(Status.eq);
//       } else {
//         resultArray.push(Status.add);
//       }
//     }
//     for (let item of compareArray) {
//       if (!arrayEq(stateArray, item)) {
//         stateArray.push(item);
//         resultArray.push(Status.lack);
//       }
//     }
//   }
//   return [stateArray, resultArray];
// };
// 空格
export const whiteSpace = (level: number): string => {
  return stringLoop('\xa0\xa0\xa0\xa0', level);
};

// 对象转json
//比如:{a:1} 输出 'a:1'
export const objectToJson = (
  obj: object,
  status: Status,
  level: number = 1,
): [string[], Status[]] => {
  let lineResult = [],
    statusResult = [];
  const array = serializeObject(obj);
  for (let [key, value, index] of array) {
    statusResult.push(status);
    if (dataType(value) === 'object') {
      let res = objectToJson(value, status, level + 1);
      lineResult.push(...res[0]);
      statusResult.push(...res[1]);
      continue;
    }
    if (dataType(value) === 'array') {
      let res = arrayToJson(value, status, level + 1);
      lineResult.push(...res[0]);
      statusResult.push(...res[1]);
      continue;
    }
    if (index === array.length - 1) {
      lineResult.push(keyValueToJson(value, { key }));
    } else {
      lineResult.push(keyValueToJson(value, { key }));
    }
  }
  return [lineResult, statusResult];
};

// Array转json
export const arrayToJson = (
  array: any[],
  status: Status,
  level: number = 1,
): [string[], Status[]] => {
  let lineResult = [],
    statusResult = [];
  for (let index in array) {
  }
  return [lineResult, statusResult];
};

// keyValue转json
interface Options {
  key?: BasicType;
  lastIndex?: false;
}
export const keyValueToJson = (
  value: BasicType,
  { key = '', lastIndex = false }: Options,
): string => {
  return `${whiteSpace}${key}${value}${lastIndex ? '' : ','}`;
};

export const objLineNumber = (obj: Object): LineNumberObj => {
  let lineObj: LineNumberObj = {};
  for (let key in obj) {
    const value = obj[key];
    if (isBaseType(value)) {
      lineObj[key] = 1;
      continue;
    }
    if (isObject(value)) {
      lineObj[key] = objLineNumber(value);
      continue;
    }
    if (Array.isArray(value)) {
      lineObj[key] = arrayLineNumber(value);
    }
  }
  return lineObj;
};

export const arrayLineNumber = (array: JsonValue[]): LineNumberValue => {
  let lineArray: LineNumberValue = [];
  for (let item of array) {
    if (isBaseType(item)) {
      lineArray.push(1);
      continue;
    }
    if (isObject(item)) {
      lineArray.push(objLineNumber(item));
      continue;
    }
    if (Array.isArray(item)) {
      lineArray.push(arrayLineNumber(item));
    }
  }
  return lineArray;
};

export const computingLineNumber = (value: JsonValue): LineNumberValue => {
  if (isBaseType(value)) {
    return 1;
  }
  if (isObject(value)) {
    return objLineNumber(value);
  }
  if (Array.isArray(value)) {
    return arrayLineNumber(value);
  }
  console.error(value, '错误输入');
  return 0;
};

export const countLineNumber = (value: LineNumberValue): number => {
  if (isBaseType(value)) {
    return 1;
  }
  let count = 2;
  if (isObject(value)) {
    for (let key in value as object) {
      count += countLineNumber(value[key]);
    }
    return count;
  }
  if (Array.isArray(value)) {
    for (let item of value) {
      count += countLineNumber(item);
    }
    return count;
  }
  console.error(value, '错误输入');
  return 0;
};

// 计算不同引用类型变量的最大行数对象
export const computingMaxLineNumber = (
  value: object | JsonValue[],
  compareValue: object | JsonValue[],
): [Status[] | StatusObj, LineNumberValue] => {
  // todo 待优化
  const valueLineNumber = computingLineNumber(value);
  const compareLineNumber = computingLineNumber(compareValue);
  const result =
    countLineNumber(valueLineNumber) >= countLineNumber(compareLineNumber) ? value : compareValue;
  return [traversingStatus(result, Status.diff), computingLineNumber(result)];
};

// 判断数组包含，位置不敏感!
export const include = (value: any, array: any[]): boolean => {
  const type = dataType(value);
  for (let item of array) {
    const itemType = dataType(item);
    if (type === itemType) {
      if (isBaseType(item)) {
        if (item === value) {
          return true;
        }
      } else {
        if (type === 'array') {
          for (let valueItem of value) {
            if (!include(valueItem, item)) {
              continue;
            }
          }
          return true;
        }
        if (type === 'object' && objEq(value, item)) {
          return true;
        }
      }
    }
  }
  return false;
};

// 判断对象是否相同
export const objEq = function (obj: object, compareObj: object): boolean {
  // 指向同一内存时
  if (obj === compareObj) {
    return true;
  }
  if (Object.keys(obj).length !== Object.keys(compareObj).length) {
    return false;
  }
  for (let key in obj) {
    if (!compareObj.hasOwnProperty(key)) {
      return false;
    }
    const value = obj[key];
    const compareValue = compareObj[key];
    const valueType = dataType(value);
    const compareValueType = dataType(compareValue);
    if (valueType !== compareValueType) {
      return false;
    }
    if (isBaseType(valueType)) {
      return value === compareValue;
    }

    if (valueType === 'array') {
      for (let valueItem of value) {
        if (!include(valueItem, compareValue)) {
          return false;
        }
      }
      return true;
    }
  }
  return true;
};
