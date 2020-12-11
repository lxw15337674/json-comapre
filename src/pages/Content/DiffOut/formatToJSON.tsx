import { BasicType, Status } from '@/common/utils/interface';
import jsonValueCallBack from '@/common/utils/jsonValueCallback';
import oppositeStatus from '@/common/utils/oppositeStatus';
import { countLineNumber, serializeObject, stringLoop } from '@/common/utils/utils';

export default (diffResult, obj, compareObj, opposite = false) => {
  return formatToJSON(diffResult, obj, compareObj, 1, opposite);
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
  const addLine = (key: BasicType, value: BasicType): string => {
    const whiteSpace = stringLoop('\xa0\xa0\xa0\xa0', level);
    if (key === '') {
      return `${whiteSpace}${value}${lastItem ? '' : ','}`;
    } else {
      return `${whiteSpace}"${key}" : ${value} ${lastItem ? '' : ','}`;
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
const formatToJSON = (
  diffResult,
  obj,
  compareObj,
  level = 1,
  opposite = false,
): [Status, string][] => {
  let result: [Status, string][] = [];
  let index = 0;
  const array = serializeObject(diffResult);
  // const addLine = (key: string, value: BasicType, status: Status): void => {
  //   const lastItem = index === array.length - 1;
  //   if (status === Status.lack) {
  //     result.push([status, '']);
  //   } else {
  //     result.push(...parse(key, value, status, level));
  //   }
  // };
  for (let [key, status, itemIndex] of array) {
    index = itemIndex;
    if (opposite) {
      status = oppositeStatus(status);
    }
    jsonValueCallBack(
      status,
      () => {
        if (status === Status.lack) {
          result.push(...new Array(countLineNumber(compareObj[key])).fill([status, '']));
          return;
        }
        if (status === Status.diff) {
          let text = parse(key, obj[key], status, level + 1);
          result.push(...text);
          let length = countLineNumber(compareObj[key]) - text.length;
          if (length > 0) {
            result.push(...new Array(length).fill([status, '']));
          }
          return;
        }
        result.push(...parse(key, obj[key], status, level + 1));
      },
      () => {
        result.push(...parse(key, obj[key], status, level + 1));
      },
      () => {
        if (Array.isArray(status)) {
          result.push(...parse(key, '[', Status.diff, level + 1));
          for (let index in status) {
            // 数组item状态只有eq、lack、add
            const state = opposite ? oppositeStatus(status[index]) : status[index];
            if (state === Status.lack) {
              result.push(...new Array(countLineNumber(compareObj[key][index])).fill([state, '']));
              continue;
            }
            result.push(...parse('', obj[key][index], state, level + 2));
          }
          result.push(...parse('', ']', Status.diff, level + 1));
          return;
        }
        if (status === Status.lack) {
          result.push(...new Array(countLineNumber(compareObj[key])).fill([status, '']));
        } else {
          result.push(...parse(key, obj[key], status, level + 1));
        }
      },
    );
  }
  if (level === 1) {
    result.unshift([Status.eq, '{']);
    result.push([Status.eq, '}']);
  }
  return result;
};

// const ArrayFormatToJson = (
//   diffResult: Status[],
//   array: any[],
//   compareArray: any[],
//   level = 1,
//   opposite = false,
// ): [Status, string][] => {
//   const whiteSpace = stringLoop('\xa0\xa0\xa0\xa0', level);
//   let result: [Status, string][] = [];
//   const addBaseType = (index: number, status: Status): void => {
//     result.push([
//       status,
//       `${whiteSpace}${array?.[index]} ${index === diffResult.length ? '' : ','}`,
//     ]);
//   };
//   const addReferenceType = (index: number, status: Status) => {
//     for (let item of stringify(array[index])) {
//       result.push([status, `${whiteSpace}${item}`]);
//     }
//   };
//   diffResult.forEach((status, index) => {
//     if (status === Status.lack) {
//       result.push(...new Array(countLineNumber(array[index])).fill([status, '']));
//       return;
//     }

//     jsonValueCallBack(
//       array[index],
//       () => {
//         addBaseType(index, status);
//       },
//       () => {
//         addReferenceType(index, status);
//       },
//       () => {
//         addReferenceType(index, status);
//       },
//     );
//   });
//   if (level === 1) {
//     result.unshift([Status.eq, '{']);
//     result.push([Status.eq, '}']);
//   }
//   return result;
// };
