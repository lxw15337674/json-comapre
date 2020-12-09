import React from 'react';
import { JsonContainer, ViewLine } from '../styled';
interface Props {
  data: any;
}
const DiffLines = ({ data }: Props) => {
  return (
    <JsonContainer>
      {/* {data.map((fn, index) => {
        return fn(({ status, value }) => {
          return (
            <ViewLine status={status} key={index}>
              {value}
            </ViewLine>
          );
        });
      })} */}
      <pre style={{ lineHeight: '25px' }}>{JSON.stringify(data, null, '\t')}</pre>
    </JsonContainer>
  );
};
export default DiffLines;
