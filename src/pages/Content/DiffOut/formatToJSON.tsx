import { BasicType, Status } from '@/common/utils/interface';
import jsonValueCallBack from '@/common/utils/jsonValueCallback';
import oppositeStatus from '@/common/utils/oppositeStatus';
import { serializeObject, stringLoop } from '@/common/utils/utils';

export default (diffResult, obj, compareObj, opposite = false) => {
  return formatToJSON(diffResult, obj, compareObj, 1, opposite);
};

const stringify = (data: any): string[] => {
  if (!data) {
    return [''];
  }
  console.log(JSON.stringify(data, null, '\t').split('\t'));
  return JSON.stringify(data, null, '\t').split('\t');
};

//TODO 处理compareValue的结果
// interface Option {
//   level?: number;
//   isArray?: boolean;
//   opposite?: boolean;
// }
const formatToJSON = (
  diffResult,
  obj,
  compareObj,
  level = 1,
  opposite = false,
): [Status, string][] => {
  const whiteSpace = stringLoop('\xa0\xa0\xa0\xa0', level);
  let result: [Status, string][] = [];
  let index = 0;
  const array = serializeObject(diffResult);
  const addLine = (key: BasicType, value: BasicType, status: Status): void => {
    const lastItem = index === array.length - 1;
    if (status === Status.lack) {
      result.push([status, '']);
      return;
    }
    let text = '';
    if (key === '') {
      text = `${whiteSpace}${value}${lastItem ? '' : ','}`;
    } else {
      text = `${whiteSpace}"${key}" : ${value} ${lastItem ? '' : ','}`;
    }
    result.push([status, text]);
  };
  const addObject = (key: string, status: object, obj: object, compareObj: object) => {
    addLine(key, '{', Status.eq);
    const res = formatToJSON(status, obj, compareObj, level + 1, opposite);
    result.push(...res);
    addLine('', '}', Status.eq);
  };
  const addArray = (key: string, status: Status[], array: any[], compareArray: any[]) => {
    addLine(key, '[', Status.eq);
    const res = ArrayFormatToJson(status, array, compareArray, level + 1, opposite);
    result.push(...res);
    addLine('', ']', Status.eq);
  };
  for (let [key, status, itemIndex] of array) {
    index = itemIndex;
    if (opposite) {
      status = oppositeStatus(status);
    }
    jsonValueCallBack(
      status,
      () => {
        addLine(key, obj?.[key] ?? '', status);
      },
      () => {
        addObject(key, status, obj[key], compareObj[key]);
      },
      () => {
        addArray(key, status, obj[key], compareObj[key]);
      },
    );
  }
  if (level === 1) {
    result.unshift([Status.eq, '{']);
    result.push([Status.eq, '}']);
  }
  return result;
};

const ArrayFormatToJson = (
  diffResult: Status[],
  array: any[],
  compareArray: any[],
  level = 1,
  opposite = false,
): [Status, string][] => {
  const whiteSpace = stringLoop('\xa0\xa0\xa0\xa0', level);
  let result: [Status, string][] = [];
  const addBaseType = (index: number, status: Status): void => {
    result.push([
      status,
      `${whiteSpace}${array?.[index]} ${index === diffResult.length ? '' : ','}`,
    ]);
  };
  const addReferenceType = (index: number, status: Status) => {
    for (let item of stringify(array[index])) {
      result.push([status, `${whiteSpace}${item}`]);
    }
  };
  diffResult.forEach((status, index) => {
    if (opposite) {
      status = oppositeStatus(status);
    }
    if (status === Status.lack) {
      for (let item of stringify(compareArray[index])) {
        result.push([status, '']);
      }
      return;
    }
    jsonValueCallBack(
      array[index],
      () => {
        addBaseType(index, status);
      },
      () => {
        addReferenceType(index, status);
      },
      () => {
        addReferenceType(index, status);
      },
    );
  });
  if (level === 1) {
    result.unshift([Status.eq, '{']);
    result.push([Status.eq, '}']);
  }
  return result;
};
