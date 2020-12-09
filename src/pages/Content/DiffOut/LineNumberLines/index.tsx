import React from 'react';
import { LineStatus, NumberLineContainer } from '../styled';
interface Props {
  data: any;
}
const LineNumberLines = ({ data }: Props) => {
  return (
    <NumberLineContainer>
      {data.map((fn, index) => {
        return fn(({ status, value }) => {
          return (
            <LineStatus status={status} key={index}>
              {index}
              {status}
            </LineStatus>
          );
        });
      })}
    </NumberLineContainer>
  );
};
export default LineNumberLines;
