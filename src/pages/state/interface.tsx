export interface State {
  sourceJson: any;
  compareJson: any;
  filterKey: string;
  selectedKeys: object;
  arrayOrderSensitive: boolean;
  json: any;
}
export type Dispatch<A> = (value: A) => void;

export enum Types {
  SetSourceJson = 'setSourceJson',
  SetCompareJson = 'setCompareJson',
  SetSelectedKeys = 'setSelectedKeys',
  ToggleArrayOrderSensitive = 'toggleArrayOrderSensitive',
}

export type Action =
  | { type: Types.SetSourceJson; sourceJson: State['sourceJson'] }
  | { type: Types.SetCompareJson; compareJson: State['compareJson'] }
  | { type: Types.SetSelectedKeys; selectedKeys: State['selectedKeys'] }
  | { type: Types.ToggleArrayOrderSensitive };

export default interface Context {
  state: State;
  dispatch: Dispatch<Action>;
}
