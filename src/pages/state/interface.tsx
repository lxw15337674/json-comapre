export interface State {
  sourceJson: any;
  compareJson: any;
  filterKey: string;
  selectedKeys: object;
  arrayOrderSensitive: boolean;
  json: any;
}
export type Dispatch<A> = (value: A) => void;

export type Action =
  | { type: 'setSourceJson'; sourceJson: State['sourceJson'] }
  | { type: 'setCompareJson'; compareJson: State['compareJson'] }
  | { type: 'setSelectedKeys'; selectedKeys: State['selectedKeys'] }
  | { type: 'toggleArrayOrderSensitive' };
export default interface Context {
  state: State;
  dispatch: Dispatch<Action>;
}
