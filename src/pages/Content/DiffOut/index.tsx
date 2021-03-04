import { oppositeDiffResult } from '@/common/utils/oppositeStatus';
import React, { useMemo } from 'react';
import compare from '../../../common/utils/jsonCompare';
import Container from './Container';
import stringify from '../../../common/utils/jsonStringify/index';
interface Props {
  value: any;
  compareValue: any;
}
const arrayOrderSensitive = true;
const DiffOut = ({ value, compareValue }: Props) => {
  const diffResult = useMemo(() => {
    console.log(compare(value, compareValue, { arrayOrderSensitive }));
    return compare(value, compareValue, { arrayOrderSensitive });
  }, [value, compareValue]);
  const [data, status] = useMemo(() => {
    return stringify(diffResult, value, compareValue, { arrayOrderSensitive });
  }, [value, compareValue]);
  const [d, s] = useMemo(() => {
    const diff = oppositeDiffResult(diffResult);
    return stringify(diff, compareValue, value, { arrayOrderSensitive });
  }, [value, compareValue, diffResult]);
  return (
    <>
      <Container data={data} status={status}></Container>
      <Container data={d} status={s}></Container>
    </>
  );
};
export default DiffOut;
