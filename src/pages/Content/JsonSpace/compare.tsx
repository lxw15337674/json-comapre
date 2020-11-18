import React, { ReactNode } from 'react';
import { BasicType, Status } from './interface';
import { AddDiv, DiffDiv, EqDiv, ReduceDiv } from './styled';
import { dataType, isObject, serializeObject, stringLoop, extend } from './utils';

const compare = (
  obj: object,
  compareObj: object,
  level: number = 1,
  isArray: boolean = false,
): [React.ReactNode[], Status[]] => {
  const whiteSpace = stringLoop('\xa0\xa0\xa0\xa0', level);
  let lineResult: Status[] = [];
  let result: ReactNode[] = [];
  let array = serializeObject(extend(obj, compareObj));
  let index = 0;
  const getContent = (key: BasicType, value: BasicType): string => {
    const lastItem = index === array.length - 1;
    key = isArray ? '' : key;
    if (key) {
      return `${whiteSpace}"${key}" : ${value} ${lastItem ? '' : ','}`;
    } else {
      return `${whiteSpace}${value}${lastItem ? '' : ','}`;
    }
  };
  const increaseLine = (key: BasicType, value: BasicType): void => {
    lineResult.push(Status.add);
    result.push(<AddDiv>{getContent(key, value)}</AddDiv>);
  };
  const lackLine = (key: BasicType, value: BasicType): void => {
    lineResult.push(Status.lack);
    result.push(<ReduceDiv>{getContent(key, value)}</ReduceDiv>);
  };
  const eqLine = (key: BasicType, value: BasicType): void => {
    lineResult.push(Status.eq);
    result.push(<EqDiv>{getContent(key, value)}</EqDiv>);
  };
  const diffLine = (key: BasicType, value: BasicType): void => {
    lineResult.push(Status.diff);
    result.push(<DiffDiv>{getContent(key, value)}</DiffDiv>);
  };
  const depthDiff = (value: object, compareValue: object) => {
    const res = compare(value, compareValue, level + 1);
    result.push(res[0]);
    lineResult.push(...res[1]);
  };
  const lackKey = (key: string, value: any) => {
    if (value === undefined) {
      return;
    }
    if (isObject(value)) {
      lackLine(key, '{');
      depthDiff({}, value);
      lackLine('', '}');
    } else {
      lackLine(key, value);
    }
  };
  const increaseKey = (key: string, value: any) => {
    if (value === undefined) {
      return;
    }
    if (isObject(value)) {
      increaseLine(key, '{');
      depthDiff(value, {});
      increaseLine('', '}');
    } else {
      increaseLine(key, value);
    }
  };
  const objectCompare = (key, obj: object, compareObj: object) => {
    eqLine(key, '{');
    depthDiff(obj, compareObj);
    eqLine('', '}');
  };
  const basicCompare = (key, val: BasicType, compareVal: BasicType) => {
    if (val === compareVal) {
      eqLine(key, val);
    } else {
      diffLine(key, val);
    }
  };
  const ArrayCompare = (key: string, array: any[], compareArray: any[]) => {
    eqLine(key, '[');
    const res = compare({ ...array }, { ...compareArray }, level + 1, true);
    result.push(res[0]);
    lineResult.push(...res[1]);
    eqLine('', ']');
    // const length = array.length >= compareArray.length ? array.length : compareArray.length;
    // for (let index = 0; index < length; index++) {
    //   const item = array[index];
    //   const compareItem = compareArray[index];
    //   // 如果value类型不同，则sourceValue全部为addDiv,compareValue为lackDiv
    //   if (dataType(item) === dataType(compareItem)) {
    //     const type = dataType(item);
    //     // 类型为数组
    //     if (type === 'array') {
    //       ArrayCompare('', item, compareItem);
    //       continue;
    //     }
    //     // 类型为对象
    //     if (type === 'object') {
    //       objectCompare('', item, compareItem);
    //       continue;
    //     }
    //     // 类型为正常值，即string|number|布尔|Null
    //     basicCompare('', item, compareItem);
    //   } else {
    //     increaseKey('', item);
    //     lackKey('', compareItem);
    //   }
    // }
  };
  for (let [key, item, itemIndex] of array) {
    index = itemIndex;
    const compareItem = compareObj[key];
    // 如果value类型不同，则sourceValue全部为addDiv,compareValue为lackDiv
    if (dataType(item) === dataType(compareItem)) {
      const type = dataType(item);
      if (item === undefined) {
        lackKey(key, compareObj[key]);
        continue;
      }
      // 类型为数组
      if (type === 'array') {
        ArrayCompare(key, item, compareItem);
        continue;
      }
      // 类型为对象
      if (type === 'object') {
        objectCompare(key, item, compareItem);
        continue;
      }
      // 类型为正常值，即string|number|布尔|Null

      basicCompare(key, item, compareItem);
    } else {
      increaseKey(key, item);
      lackKey(key, compareItem);
    }
  }

  // // 去除最后item的逗号
  // let listChildren: any = result[result.length - 1];
  // console.log(listChildren);
  // listChildren.props = {
  //   children: listChildren.props.children.slice(0, listChildren.props.children.length - 1),
  // };

  if (level === 1) {
    result.unshift(<EqDiv>{'{'}</EqDiv>);
    result.push(<EqDiv>{'}'}</EqDiv>);
    lineResult.unshift(Status.eq);
    lineResult.push(Status.eq);
  }
  return [result, lineResult];
};
export default compare;
