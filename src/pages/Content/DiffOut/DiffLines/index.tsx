import { BasicType, Status } from '@/common/utils/interface';
import jsonValueCallBack from '@/common/utils/jsonValueCallback';
import { serializeObject } from '@/common/utils/utils';
import React from 'react';
import { JsonContainer, ViewLine } from '../styled';
interface Props {
  data: any;
  diffResult: any;
  compareData: any;
}



const DiffLines = ({ diffResult, data, compareData }: Props) => {
  // formatToJSON()
};
export default DiffLines;
