import React, { useRef } from 'react';
import LineNumberLines from '../LineNumberLine';
import { JsonContainer, ViewLine } from '../styled';
import { Status } from '@/common/utils/interface';
import useSyncScroll from '@/common/hooks/useSyncScroll';
interface Props {
  data: string[];
  status: Status[];
}
const Container = ({ data, status }: Props) => {
  const lines = useRef<HTMLElement>();
  const json = useRef<HTMLElement>();
  useSyncScroll([lines, json], 'top');
  return (
    <>
      <LineNumberLines data={status} ref={lines} />
      <JsonContainer ref={json}>
        {data.map((text, index) => {
          return (
            <ViewLine status={status[index]} key={index}>
              {text}
            </ViewLine>
          );
        })}
      </JsonContainer>
    </>
  );
};
export default Container;
