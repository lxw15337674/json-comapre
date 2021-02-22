import oppositeStatus from '@/common/utils/oppositeStatus';
import React, { useMemo } from 'react';
import compare from '../../../common/utils/jsonCompare';
import Container from './Container';
import formatToJSON from './formatToJSON';
interface Props {
  value: any;
  compareValue: any;
}

const DiffOut = ({ value, compareValue }: Props) => {
  const [status, data] = useMemo(() => {
    return formatToJSON(compare(value, compareValue), value, compareValue);
  }, [value, compareValue]);
  console.log(compare(value, compareValue));
  const compareStatus = useMemo(() => {
    return status.map((item) => oppositeStatus(item));
  }, [status]);
  const compareData = useMemo(() => {
    return formatToJSON(compare(compareValue, value), compareValue, value)[1];
  }, [value, compareValue]);
  return (
    <>
      <Container data={data} status={status}></Container>
      <Container data={compareData} status={compareStatus}></Container>
    </>
  );
};
export default DiffOut;
