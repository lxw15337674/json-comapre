/* eslint-disable no-unused-vars */

import React from 'react';
import Compare from './Compare';

interface Props {
  result: object;
  source: object;
}

// 字符串转换为diff结果
const View = (props: Props) => {
  return <Compare {...props}></Compare>;
};
export default View;
