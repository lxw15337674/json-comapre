import jsonValueCallBack from '@/common/utils/jsonValueCallback';
import { serializeObject } from '@/common/utils/utils';
import React from 'react';
import { JsonContainer, ViewLine } from '../styled';
interface Props {
  data: any;
  
}

const DiffLines = ({ data, compare = false }: Props) => {
  // console.log(JSON.stringify(data, null, '\t'));
  return <pre style={{ lineHeight: '25px' }}>{JSON.stringify(data, null, '\t')}</pre>;
  // return (
  //   <>{serializeObject(data).map(({ keys, values, index }) => {

  //   })}</>

  // return jsonValueCallBack(
  //   value,
  //   () => {
  //     return (
  //       <ViewLine status={status} key={index}>
  //         {value}
  //       </ViewLine>
  //     );
  //   },
  //   () => {
  //     <ViewLine status={status} key={index}>
  //       {value}
  //     </ViewLine>;
  //   },
  //   () => {
  //     <ViewLine status={status} key={index}>
  //       {value}
  //     </ViewLine>;
  //   },
  // );
};
export default DiffLines;
