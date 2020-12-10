import { BasicType, Status } from '@/common/utils/interface';
import jsonValueCallBack from '@/common/utils/jsonValueCallback';
import { serializeObject, stringLoop } from '@/common/utils/utils';

//TODO 处理compareValue的结果
const formatToJSON = (
  diffResult,
  obj,
  compareObj,
  level: number = 1,
  isArray: boolean = false,
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
    if (isArray || key === '') {
      text = `${whiteSpace}${value}${lastItem ? '' : ','}`;
    } else {
      text = `${whiteSpace}"${key}" : ${value} ${lastItem ? '' : ','}`;
    }
    result.push([status, text]);
  };
  const addObject = (key: string, status: object, obj: object, compareObj: object) => {
    addLine(key, '{', Status.eq);
    const res = formatToJSON(status, obj, compareObj, level + 1);
    result.push(...res);
    addLine('', '}', Status.eq);
  };
  const addArray = (key: string, status: Status[], array: any[], compareArray: any[]) => {
    addLine(key, '[', Status.eq);
    const res = formatToJSON(status, { ...array }, { ...compareArray }, level + 1, true);
    result.push(...res);
    addLine('', ']', Status.eq);
  };
  for (let [key, status, itemIndex] of array) {
    index = itemIndex;
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
export default formatToJSON;
