import oppositeStatus from '@/common/utils/oppositeStatus';
import React, { useMemo } from 'react';
import compare from '../../../common/utils/jsonCompare';
import Container from './Container';
import formatToJSON from './formatToJSON';
interface Props {
  value: object;
  compareValue: object;
}

const DiffOut = ({ value, compareValue }: Props) => {
  const JSON = useMemo(() => {
    return formatToJSON(compare(value, compareValue), value, compareValue);
  }, [value, compareValue]);
  return (
    <>
      <Container data={JSON}></Container>
      <Container data={JSON.map((item) => [oppositeStatus(item[0]), item[1]])}></Container>
    </>
  );
};
export default DiffOut;
