import { curry4 } from '@/common/utils/curry';
import { BasicType, Status } from '@/common/utils/interface';
import jsonValueCallBack from '@/common/utils/jsonValueCallback';
import { copy, countLineNumber, find, serializeObject, stringLoop } from '@/common/utils/utils';

//TODO 改为输出[string[],Status[]]
export default (diffResult, json, compareJson): [Status[], string[]] => {
  const data = formatToJSON(diffResult, json, compareJson, 1);
  return [data.map((item) => item[0]), data.map((item) => item[1])];
};

// 填充状态list
const fillStatusList = (textList: string[], status: Status) => {
  return textList.map((_) => status);
};
// 处理数据
const appendData = (
  textResult: string[],
  statusResult: Status[],
  textList: string[],
  status: Status,
) => {
  textResult.push(...textList);
  statusResult.push(...fillStatusList(textList, status));
};

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
const parse = (key: string, value: any, status, level = 1, lastItem = false): string[] => {
  let textList: string[] = [];
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
      textList.push(addLine(key, value));
    },
    () => {
      textList.push(addLine(key, '{'));
      for (let valueKey in value) {
        const text = parse(valueKey, value[valueKey], status, level + 1);
        textList.push(...text);
      }
      textList.push(addLine(key, '}'));
    },
    () => {
      textList.push(addLine(key, '['));
      for (let item of value) {
        const text = parse('', item, status, level + 1);
        textList.push(...text);
      }
      textList.push(addLine(key, ']'));
    },
  );
  return textList;
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
  const array = serializeObject(diffResult);
  for (let [key, status, index] of array) {
    const lastItem = index === array.length - 1;
    jsonValueCallBack(
      status,
      () => {
        if (status === Status.lack) {
          const text = parse(key, compareJson[key], status, level + 1);
          append(text, status);
          return;
        }
        if (status === Status.diff) {
          const text = parse(key, json[key], status, level + 1);
          append(text, status);
          const length = countLineNumber(compareJson[key]) - text.length;
          if (length > 0) {
            append(new Array(length).fill(''), status);
          }
          return;
        }
        const text = parse(key, json[key], status, level + 1);
        append(text, status);
      },
      () => {
        const text = parse(key, json[key], status, level + 1);
        append(text, status);
      },
      () => {
        const [t, s] = arrayToJSON(status, json[key], compareJson[key], level + 1);
        textList.push(...t);
        statusList.push(...s);
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
  const append = curry4(appendData)(textList, statusList);
  const wrapper = curry4(wrapperData)(textList, statusList);
  for (let [state, item] of serializeArrayFormat(status, array, compareArray)) {
    append(parse('', item, state, level + 1), state);
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
      result.push([status, compareArray[0]]);
      compareArray.splice(0, 1);
    } else {
      const compareIndex = find(array[index], compareArray);
      if (compareIndex > -1) {
        compareArray.splice(compareIndex, 1);
      }
      result.push([status, array[index]]);
    }
  }
  for (let item of compareArray) {
    result.push([Status.lack, item]);
  }
  return result;
}
