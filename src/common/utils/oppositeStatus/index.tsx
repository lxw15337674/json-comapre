import { Status } from '../interface';
import jsonValueCallBack from '@/common/utils/jsonValueCallback';

export const oppositeStatus = (status: Status): Status => {
  if (status === Status.add) {
    return Status.lack;
  }
  if (status === Status.lack) {
    return Status.add;
  }
  return status;
};

export const oppositeDiffResult = (diffResult) => {
  return jsonValueCallBack(
    diffResult,
    () => {
      return oppositeStatus(diffResult);
    },
    () => {
      const res = {};
      for (let item in diffResult) {
        res[item] = oppositeDiffResult(diffResult[item]);
      }
      return res;
    },
    () => {
      return diffResult.map((item) => {
        return oppositeDiffResult(item);
      });
    },
  );
};
