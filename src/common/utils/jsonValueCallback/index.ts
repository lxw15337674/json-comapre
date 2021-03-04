import { dataType } from '../utils';
import { JsonValue } from './../interface';

const jsonValueCallBack = (value: JsonValue, basicTypeFn, ObjectFn, ArrayFn) => {
  const type = dataType(value);
  if (type === 'object') {
    return ObjectFn(value);
  }
  if (type === 'array') {
    return ArrayFn(value);
  }
  return basicTypeFn(value);
};

export default jsonValueCallBack;
