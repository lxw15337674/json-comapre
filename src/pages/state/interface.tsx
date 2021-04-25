export interface State {
  sourceJson: string;
  compareJson: string;
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
  Reset = 'reset',
}

export type Action =
  | { type: Types.SetSourceJson; sourceJson: State['sourceJson'] }
  | { type: Types.SetCompareJson; compareJson: State['compareJson'] }
  | { type: Types.SetSelectedKeys; selectedKeys: State['selectedKeys'] }
  | { type: Types.ToggleArrayOrderSensitive }
  | { type: Types.ToggleArrayOrderSensitive }
  | { type: Types.Reset };

export default interface Context {
  state: State;
  dispatch: Dispatch<Action>;
}
