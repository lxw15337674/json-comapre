import React, { useMemo } from 'react';
import LineNumberLines from './LineNumberLine';
import { JsonContainer,ViewLine } from '../styled';
interface Props {
  data:any[]
}
const Container = ({data}: Props) => {
    const Status = useMemo(()=>{
        return data.map(item=>item[0]) 
      },[data])
  return (
      <>
    <LineNumberLines data={Status}  />
    <JsonContainer>
      {data.map(([status, text], index) => {
        return (
          <ViewLine status={status} key={index}>
            {text}
          </ViewLine>
        );
      })}
    </JsonContainer>
    </>
  );
};
export default Container;
