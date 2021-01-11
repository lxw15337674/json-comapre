import React from 'react';
import { LineStatus, NumberLineContainer } from '../../styled';
interface Props {
  data:any[]
}
const LineNumberLines = ({data}: Props) => {
  return (
    <NumberLineContainer>
        {data.map((status, index) => {
          return (
            <LineStatus status={status} key={index}>
            {index}
          </LineStatus>
          );
        })}
    </NumberLineContainer>
  );
};
export default LineNumberLines;
