import { curry4 } from '@/common/utils/curry';
import { BasicType, Status } from '@/common/utils/interface';
import jsonValueCallBack from '@/common/utils/jsonValueCallback';
import {
  copy,
  countLineNumber,
  dataType,
  find,
  isBaseType,
  serializeObject,
  stringLoop,
} from '@/common/utils/utils';

export default (diffResult, json, compareJson): [string[], Status[]] => {
  const data = formatToJSON(diffResult, json, compareJson, 1);
  return data;
};

// 填充状态list
const fillStatusList = (textList: string[], status: Status) => {
  return textList.map((_) => status);
};
// 处理数据
function appendData(
  textResult: string[],
  statusResult: Status[],
  textList: string[] | string,
  status: Status,
) {
  if (Array.isArray(textList)) {
    textResult.push(...textList);
    statusResult.push(...fillStatusList(textList, status));
  } else {
    textResult.push(textList);
    statusResult.push(status);
  }
}
function pushData(textResult: string[], statusResult: Status[], result: [string[], Status[]]) {
  const [text, status] = result;
  textResult.push(...text);
  statusResult.push(...status);
}
const wrapperData = (
  textList: string[],
  statusList: Status[],
  isArray: boolean,
  status: Status,
) => {
  if (isArray) {
    textList.unshift('[');
    textList.push(']');
  } else {
    textList.unshift('{');
    textList.push('}');
  }
  statusList.unshift(status);
  statusList.push(status);
};

// 格式化key，value
const parse = (
  key: string,
  value: any,
  status,
  level = 1,
  lastItem = false,
): [string[], Status[]] => {
  const textList: string[] = [];
  const statusList: Status[] = [];
  const append = curry4(appendData)(textList, statusList);
  const push = curry4(pushData)(textList, statusList);
  const whiteSpace = stringLoop('\xa0\xa0\xa0\xa0', level);
  const addLine = (key: BasicType, value: BasicType, comma = true): string => {
    if (key === '') {
      return `${whiteSpace}${JSON.stringify(value)}${comma ? ',' : ''}`;
    } else {
      return `${whiteSpace}"${key}" : ${JSON.stringify(value)} ${comma ? ',' : ''}`;
    }
  };
  const wrapperData = (isArray: boolean, status: Status) => {
    if (isArray) {
      textList.unshift(`${whiteSpace}[`);
      textList.push(`${whiteSpace}]`);
    } else {
      textList.unshift(`${whiteSpace}{`);
      textList.push(`${whiteSpace}}`);
    }
    statusList.unshift(status);
    statusList.push(status);
  };
  jsonValueCallBack(
    value,
    () => {
      append(addLine(key, value), status);
    },
    () => {
      jsonValueCallBack(
        status,
        () => {
          for (let valueKey in value) {
            push(parse(valueKey, value[valueKey], status, level + 1));
          }
          wrapperData(false, status);
        },
        () => {
          append(`${whiteSpace}${key} : {`, Status.eq);
          for (let valueKey in value) {
            push(parse(valueKey, value[valueKey], status[valueKey], level + 1));
          }
          wrapperData(false, Status.eq);
        },
        () => {},
      );
    },
    () => {
      jsonValueCallBack(
        status,
        () => {
          for (let item in value) {
            push(parse('', item, status, level + 1));
          }
          wrapperData(true, status);
        },
        () => {},
        () => {
          for (let index in value) {
            push(parse('', value[index], status[index], level + 1));
          }
          wrapperData(true, Status.eq);
        },
      );
    },
  );
  return [textList, statusList];
};

// interface Option {
//   level?: number;
//   isArray?: boolean;
//   opposite?: boolean;
// }
const formatToJSON = (diffResult, json, compareJson, level = 1): [string[], Status[]] => {
  const isArray = Array.isArray(diffResult);
  if (isArray) {
    return arrayToJSON(diffResult, json, compareJson);
  }
  const textList: string[] = [];
  const statusList: Status[] = [];
  const append = curry4(appendData)(textList, statusList);
  const wrapper = curry4(wrapperData)(textList, statusList);
  const push = curry4(pushData)(textList, statusList);
  let array = [];
  if (isBaseType(diffResult)) {
    return [[], []];
  }

  array = serializeObject(diffResult);
  // const array = serializeObject(diffResult);
  for (let [key, status, index] of array) {
    const lastItem = index === array.length - 1;
    jsonValueCallBack(
      status,
      () => {
        if (status === Status.lack) {
          push(parse(key, compareJson[key], status, level + 1));
          return;
        }
        if (status === Status.diff) {
          const [t, s] = parse(key, json[key], status, level + 1);
          textList.push(...t);
          statusList.push(...s);
          const length = parse(key, compareJson[key], status, level + 1)[0].length - t.length;
          if (length > 0) {
            append(new Array(length).fill(''), status);
          }
          return;
        }
        push(parse(key, json[key], status, level + 1));
      },
      () => {
        push(parse(key, json[key], status, level + 1));
      },
      () => {
        push(arrayToJSON(status, json[key], compareJson[key], level + 1));
      },
    );
  }
  if (level === 1) {
    if (isArray) {
      wrapper(true, Status.eq);
    } else {
      wrapper(false, Status.eq);
    }
  }
  return [textList, statusList];
};

function arrayToJSON(
  status: Status[],
  array: any[],
  compareArray: any[],
  level = 0,
  lastItem = false,
): [string[], Status[]] {
  let textList = [];
  let statusList = [];
  const wrapper = curry4(wrapperData)(textList, statusList);
  const push = curry4(pushData)(textList, statusList);
  for (let [item, state] of serializeArrayFormat(status, array, compareArray)) {
    push(parse('', item, state, level + 1));
  }
  wrapper(true, Status.diff);
  return [textList, statusList];
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
      result.push([compareArray[0], status]);
      compareArray.splice(0, 1);
    } else {
      const compareIndex = find(array[index], compareArray);
      if (compareIndex > -1) {
        compareArray.splice(compareIndex, 1);
      }
      result.push([array[index], status]);
    }
  }
  for (let item of compareArray) {
    result.push([item, Status.lack]);
  }
  return result;
}
