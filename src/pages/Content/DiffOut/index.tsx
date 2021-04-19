import { oppositeDiffResult } from '@/common/utils/oppositeStatus';
import React, { useMemo, useRef } from 'react';
import compare from '../../../common/utils/jsonCompare';
import Container from './Container';
import stringify from '../../../common/utils/jsonStringify/index';
import useSyncScroll from '@/common/hooks/useSyncScroll';
interface Props {
  value: any;
  compareValue: any;
}
const arrayOrderSensitive = true;
const DiffOut = ({ value, compareValue }: Props) => {
  const containerRef = useRef<HTMLElement>();
  const compareContainerRef = useRef<HTMLElement>();
  useSyncScroll([containerRef, compareContainerRef], 'top');
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
      <Container data={data} status={status} contentRefs={containerRef}></Container>
      <Container data={d} status={s} contentRefs={compareContainerRef}></Container>
    </>
  );
};
export default DiffOut;
