import React from 'react';
import { AddDiv, DiffDiv, EqDiv, ReduceDiv } from './styled';
interface Props {
  obj: object;
  compareObj: object;
  level: number;
}

const compare = ({ obj, compareObj, level = 0 }: Props) => {
  const whiteSpace = stringLoop('\xa0\xa0\xa0\xa0', level);
  let result = Object.entries(obj).reduce((acc, cur, index) => {
    const [key, value] = cur;
    const compareValue = compareObj[key];
    // 如果value是对象，则比较value
    if (isObject(value)) {
      // 如果compareValue是对象，则进行递归
      if (isObject(compareValue)) {
        acc.push(<div>{compare(value, compareValue, level + 1)}</div>);
      } else {
        // 如果compareValue不是对象，则sourceValue全部为addDiv,compareValue为reduceDiv，
        acc.push(<div>{compare(value, {}, level + 1)}</div>);
        acc.push(<ReduceDiv>{`${whiteSpace}${key}:${compareValue}`}</ReduceDiv>);
      }
    }
    // 如果value不是对象，则进行比较
    // 如果compareValue是对象，则sourceValue为reduceDiv，并所有compareValue为addDiv
    if (isObject(compareValue)) {
      acc.push(<ReduceDiv>{`${whiteSpace}${key}:${value}`}</ReduceDiv>);
      acc.push(<div>{compare({}, compareValue, level + 1)}</div>);
    }
    // 如果compareValue不存在，则sourceValue为addDiv
    if (compareValue === undefined) {
      acc.push(<AddDiv>{`${whiteSpace}${key}:${value}`}</AddDiv>);
    }
    // 进行真正的比较
    // 这个地方就要进行隐式转换为string，进行比较，解决数组等类型的问题
    // eslint-disable-next-line eqeqeq
    if (value == compareValue) {
      acc.push(<EqDiv>{`${whiteSpace}${key}:${value}`}</EqDiv>);
    } else {
      acc.push(<DiffDiv>{`${whiteSpace}${key}:${value}`}</DiffDiv>);
    }
    return acc;
  }, []);
  // 处理compareObj存在，obj不存在的key
  for (let key in compareObj) {
    const compareValue = compareObj[key];
    if (!obj[key]) {
      if (isObject(compareObj[key])) {
        result.push(<div>{compare({}, compareValue, level + 1)}</div>);
      } else {
        result.push(<ReduceDiv>{`${whiteSpace}${key}:${compareValue}`}</ReduceDiv>);
      }
    }
  }
  return result;
};
export default compare;
