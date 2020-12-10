import { Status } from '../interface';

export default (status: Status): Status => {
  if (status === Status.add) {
    return Status.lack;
  }
  if (status === Status.lack) {
    return Status.add;
  }
  return status;
};
