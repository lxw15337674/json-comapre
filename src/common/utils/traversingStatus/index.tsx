import { Status } from '../interface';
import { dataType, isBaseType } from '../utils';

const traversingStatus = (value: any, status: Status = Status.diff): any => {
  if (isBaseType(value)) {
    return status;
  }
  const type = dataType(value);
  if (type === 'object') {
    let result = {};
    for (let key in value) {
      result[key] = traversingStatus(value[key], status);
    }
    return result;
  }
  if (type === 'array') {
    let result = [];
    for (let item of value) {
      result.push(traversingStatus(item, status));
    }
    return result;
  }
};

export default traversingStatus;
