import { BasicType, Status } from '@/common/utils/interface';
import jsonValueCallBack from '@/common/utils/jsonValueCallback';
import {
  copy,
  countLineNumber,
  find,
  serializeObject,
  stringLoop,
} from '@/common/utils/utils';

export default (diffResult, obj, compareObj) => {
  return formatToJSON(diffResult, obj, compareObj, 1);
};

// 格式化key，value
const parse = (
  key: string,
  value: any,
  status,
  level = 1,
  lastItem = false,
): [Status, string][] => {
  let result = [];
  const addLine = (key: BasicType, value: BasicType, comma = true): string => {
    const whiteSpace = stringLoop('\xa0\xa0\xa0\xa0', level);
    if (key === '') {
      return `${whiteSpace}${value}${comma ? ',' : ''}`;
    } else {
      return `${whiteSpace}"${key}" : ${value} ${comma ? ',' : ''}`;
    }
  };
  jsonValueCallBack(
    value,
    () => {
      result.push([status, addLine(key, value)]);
    },
    () => {
      result.push([status, addLine(key, '{')]);
      for (let valueKey in value) {
        result.push(...parse(valueKey, value[valueKey], status, level + 1));
      }
      result.push([status, addLine('', '}')]);
    },
    () => {
      result.push([status, addLine(key, '[')]);
      for (let item of value) {
        result.push(...parse('', item, status, level + 1));
      }
      result.push([status, addLine('', ']')]);
    },
  );
  return result;
};

//TODO 处理compareValue的结果
// interface Option {
//   level?: number;
//   isArray?: boolean;
//   opposite?: boolean;
// }
const formatToJSON = (diffResult, obj, compareObj, level = 1): [Status, string][] => {
  const isArray = Array.isArray(diffResult);
  if (isArray) {
    return arrayToJSON(diffResult, obj, compareObj);
  }
  let result: [Status, string][] = [];
  const array = serializeObject(diffResult);
  for (let [key, status, index] of array) {
    const lastItem = index === array.length - 1;
    jsonValueCallBack(
      status,
      () => {
        if (status === Status.lack) {
          result.push(...parse(isArray ? key : '', compareObj[key], status, level + 1));
          return;
        }
        if (status === Status.diff) {
          let text = parse(isArray ? key : '', obj[key], status, level + 1);
          result.push(...text);
          let length = countLineNumber(compareObj[key]) - text.length;
          if (length > 0) {
            result.push(...new Array(length).fill([status, '']));
          }
          return;
        }
        result.push(...parse(isArray ? key : '', obj[key], status, level + 1));
      },
      () => {
        result.push(...parse(isArray ? key : '', obj[key], status, level + 1));
      },
      () => {
        if (Array.isArray(status)) {
          arrayToJSON(status, obj[key], compareObj[key], level + 1);
        }
        result.push(...parse(isArray ? key : '', obj[key], status, level + 1));
      },
    );
  }
  if (level === 1) {
    if (isArray) {
      result.unshift([Status.eq, '[']);
      result.push([Status.eq, ']']);
    } else {
      result.unshift([Status.eq, '{']);
      result.push([Status.eq, '}']);
    }
  }
  return result;
};

function arrayToJSON(
  status: Status[],
  array: any[],
  compareArray: any[],
  level = 0,
  lastItem = false,
) {
  let result = [];
  result.push(...parse('', '[', Status.diff, level, false));
  for (let [state, item] of serializeArrayFormat(status, array, compareArray)) {
    result.push(...parse('', item, state, level + 1));
  }
  result.push(...parse('', ']', Status.diff, level, lastItem));
  return result;
}

// 序列化数组
// diff结果：['+',"-","="], [1,3,4],[2,3,4]
function serializeArrayFormat(diffResult: Status[], array: any[], compareArray: any[]) {
  let result = [];
  array = copy(array);
  compareArray = copy(compareArray);
  for (let index in diffResult) {
    const status = diffResult[index];
    if (status === Status.lack) {
      result.push([status, compareArray[0]]);
      compareArray.splice(0, 1);
    } else {
      const compareIndex = find(array[index], compareArray);
      if(compareIndex>-1){
        compareArray.splice(compareIndex, 1);
      }
      result.push([status, array[index]]);
    }
  }
  for(let item of compareArray){
    result.push([Status.lack,item])
  }
  return result;
}
