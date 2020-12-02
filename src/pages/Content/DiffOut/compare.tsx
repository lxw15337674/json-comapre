import { BasicType, Status } from './interface';
import { dataType, serializeObject, stringLoop, isObject, extend } from '../../../common/utils/utils';

const compare = (
  obj: object,
  compareObj: object,
  level: number = 1,
  isArray: boolean = false,
): [string[], Status[]] => {
  const whiteSpace = stringLoop('\xa0\xa0\xa0\xa0', level);
  let lineResult: Status[] = [];
  let result: string[] = [];
  const array = serializeObject(extend(obj, compareObj));
  let index = 0;
  const addLine = (key: BasicType, value: BasicType, type: Status): void => {
    lineResult.push(type);
    const lastItem = index === array.length - 1;
    key = isArray ? '' : key;
    if (key) {
      result.push(`${whiteSpace}"${key}" : ${value} ${lastItem ? '' : ','}`);
    } else {
      result.push(`${whiteSpace}${value}${lastItem ? '' : ','}`);
    }
  };
  const objectCompare = (key, obj: object, compareObj: any) => {
    if (compareObj === undefined) {
      addLine(key, '{', Status.add);
      const res = compare(obj, {}, level + 1);
      result.push(...res[0]);
      lineResult.push(...res[1]);
      addLine('', '}', Status.add);
      return;
    }
    if (isObject(compareObj)) {
      addLine(key, '{', Status.eq);
      const res = compare(obj, compareObj, level + 1);
      result.push(...res[0]);
      lineResult.push(...res[1]);
      addLine('', '}', Status.eq);
    } else {
      addLine(key, '{', Status.diff);
      const res = compare(
        obj,
        Object.keys(obj).reduce((acc, cur) => {
          acc[cur] = Symbol();
          return acc;
        }, {}),
        level + 1,
      );
      result.push(...res[0]);
      lineResult.push(...res[1]);
      addLine('', '}', Status.diff);
    }
  };
  const ArrayCompare = (key: string, array: any[], compareArray: any[]) => {
    if (compareArray === undefined) {
      addLine(key, '[', Status.add);
      const res = compare({ ...array }, [], level + 1, true);
      result.push(...res[0]);
      lineResult.push(...res[1]);
      addLine('', ']', Status.add);
      return;
    }
    if (dataType(compareArray) === 'array') {
      addLine(key, '[', Status.eq);
      const res = compare({ ...array }, { ...compareArray }, level + 1, true);
      result.push(...res[0]);
      lineResult.push(...res[1]);
      addLine('', ']', Status.eq);
      return;
    } else {
      addLine(key, '[', Status.diff);
      const res = compare({ ...array }, Array(array.length).fill(Symbol()), level + 1, true);
      result.push(...res[0]);
      lineResult.push(...res[1]);
      addLine('', ']', Status.diff);
    }
  };
  const basicCompare = (key, val: BasicType, compareVal: any) => {
    if (val === undefined) {
      const compareValType = dataType(compareVal);
      if (compareValType === 'array') {
        ArrayCompare(key, [], compareVal);
        return;
      }
      if (compareValType === 'object') {
        objectCompare(key, {}, compareVal);
        return;
      }
      addLine(key, compareVal, Status.lack);
      return;
    }
    if (compareVal === undefined) {
      addLine(key, val, Status.add);
      return;
    }
    if (val === compareVal) {
      addLine(key, val, Status.eq);
    } else {
      addLine(key, val, Status.diff);
    }
  };

  for (let [key, item, itemIndex] of array) {
    index = itemIndex;
    const compareItem = compareObj[key];
    const sourceItemType = dataType(item);
    if (sourceItemType === 'array') {
      ArrayCompare(key, item, compareItem);
      continue;
    }
    if (sourceItemType === 'object') {
      objectCompare(key, item, compareItem);
      continue;
    }
    // 类型为正常值，即string|number|布尔|Null
    basicCompare(key, item, compareItem);
  }

  if (level === 1) {
    result.unshift('{');
    result.push('}');
    lineResult.unshift(Status.eq);
    lineResult.push(Status.eq);
  }
  return [result, lineResult];
};
export default compare;
