import React, { useEffect, useMemo, useState } from 'react';
import { StyledContainer } from './styled';
import { Button, Input } from 'antd';
import { compare } from './utils';
import View from './View';
const { TextArea } = Input;
interface Props {
  value: string;
  compareValue?: string;
  setValue: (value: React.SetStateAction<string>) => void;
}

const CodeContainer = ({ value, compareValue, setValue }: Props) => {
  // const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log(e.target.value);
  //   setValue(e.target.value || '');
  // };
  // const onKeyup = (e: any) => {
  //   // enter换行
  //   // if (e.keyCode === 13) {
  //   //   console.log('enter');
  //   //   setValue((str) => str + '/r/n');
  //   // }
  // };
  // const onPaste = (e: any) => {
  //   // 如果剪贴板没有数据则直接返回
  //   if (!(e.clipboardData && e.clipboardData.items)) {
  //     return;
  //   }
  //   e.preventDefault();
  //   const text = e.clipboardData.getData('text/plain');
  //   setValue(text);
  // };
  const [isJson, setIsJson] = useState(true);
  const onInput = (e) => {
    const value = e.target.value;
    try {
      setValue(JSON.stringify(JSON.parse(value), null, 4));
      setIsJson(true);
    } catch (e) {
      console.log(e);
      setIsJson(false);
      setValue(value);
    }
  };
  const compareResult = useMemo(() => {
    let obj,
      compareObj,
      canCompare = true;
    try {
      obj = JSON.parse(value);
      compareObj = JSON.parse(compareValue);
    } catch (e) {
      canCompare = false;
    }
    if (canCompare) {
      return compare(obj, compareObj);
    } else {
      return {};
    }
  }, [compareValue, value]);
  return (
    <StyledContainer isJson={isJson}>
      <View result={compareResult} source={JSON.parse(value)}></View>
      <TextArea value={value} onChange={onInput}></TextArea>
    </StyledContainer>
  );
};
export default CodeContainer;
