import { oppositeDiffResult } from '@/common/utils/oppositeStatus';
import React, { useMemo } from 'react';
import compare from '../../../common/utils/jsonCompare';
import Container from './Container';
import formatToJSON from '../../../common/utils/jsonStringify';
interface Props {
  value: any;
  compareValue: any;
}

const DiffOut = ({ value, compareValue }: Props) => {
  const diffResult = useMemo(() => {
    return compare(value, compareValue);
  }, [value, compareValue]);
  const [data, status] = useMemo(() => {
    return formatToJSON(diffResult, value, compareValue);
  }, [value, compareValue]);
  const [d, s] = useMemo(() => {
    const diff = oppositeDiffResult(diffResult);
    return formatToJSON(diff, compareValue, value);
  }, [value, compareValue, diffResult]);
  return (
    <>
      <Container data={data} status={status}></Container>
      <Container data={d} status={s}></Container>
    </>
  );
};
export default DiffOut;
