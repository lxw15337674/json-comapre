import { oppositeDiffResult } from '@/common/utils/oppositeStatus';
import React, { useMemo, useRef } from 'react';
import compare from '../../../common/utils/jsonCompare';
import Container from './Container';
import stringify from '../../../common/utils/jsonStringify';
// import stringify from '../../../common/utils/stringify';
import useSyncScroll from '@/common/hooks/useSyncScroll';
import { isJSON } from '@/common/utils/utils';
interface Props {
  value: string;
  compareValue: string;
}
const arrayOrderSensitive = true;
const DiffOut = ({ value, compareValue }: Props) => {
  const containerRef = useRef<HTMLElement>();
  const compareContainerRef = useRef<HTMLElement>();
  useSyncScroll([containerRef, compareContainerRef], 'top');

  const valueJson = useMemo(() => {
    return isJSON(value) ? JSON.parse(value) : null;
  }, [value]);

  const compareJson = useMemo(() => {
    return isJSON(compareValue) ? JSON.parse(compareValue) : null;
  }, [compareValue]);

  const diffResult = useMemo(() => {
    // console.log(compare(valueJson, compareJson, { arrayOrderSensitive }));
    return compare(valueJson, compareJson, { arrayOrderSensitive });
  }, [valueJson, compareJson]);

  const [data, status] = useMemo(() => {
    return stringify(diffResult, valueJson, compareJson, { arrayOrderSensitive });
  }, [valueJson, compareJson]);

  const [d, s] = useMemo(() => {
    const diff = oppositeDiffResult(diffResult);
    return stringify(diff, compareJson, valueJson, { arrayOrderSensitive });
  }, [valueJson, compareJson, diffResult]);

  return (
    <>
      <Container data={data} status={status} contentRefs={containerRef}></Container>
      <Container data={d} status={s} contentRefs={compareContainerRef}></Container>
    </>
  );
};
export default DiffOut;
