import React from 'react';
import { LineStatus, NumberLineContainer } from '../styled';
interface Props {
  data: any[];
}
const LineNumberLines = React.forwardRef(({ data }: Props, ref) => {
  return (
    <NumberLineContainer ref={ref}>
      {data.map((status, index) => {
        return (
          <LineStatus status={status} key={index}>
            {index}
          </LineStatus>
        );
      })}
    </NumberLineContainer>
  );
});
export default LineNumberLines;
