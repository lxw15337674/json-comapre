import React, { useRef } from 'react';
import LineNumberLines from '../LineNumberLine';
import { JsonContainer, ViewLine } from '../styled';
import { Status } from '@/common/utils/interface';
import useSyncScroll from '@/common/hooks/useSyncScroll';
interface Props {
  data: string[];
  status: Status[];
  contentRefs?: React.MutableRefObject<HTMLElement>;
}
const Container = ({ data, status, contentRefs }: Props) => {
  const line = useRef<HTMLElement>();
  useSyncScroll([contentRefs, line], 'top');
  return (
    <>
      <LineNumberLines data={status} ref={line} />
      <JsonContainer ref={contentRefs}>
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
