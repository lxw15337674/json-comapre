import React from 'react';
import LineNumberLines from '../LineNumberLine';
import { JsonContainer, ViewLine } from '../styled';
import { Status } from '@/common/utils/interface';
interface Props {
  data: string[];
  status: Status[];
}
const Container = ({ data, status }: Props) => {
  return (
    <>
      <LineNumberLines data={status} />
      <JsonContainer>
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
