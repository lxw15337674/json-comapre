export interface State {
  sourceJson: string;
  compareJson: string;
  filterKey: string;
}

export type Action =
  | { type: 'setSourceJson'; sourceJson: string }
  | { type: 'setCompareJson'; compareJson: string };

export default interface Context {
  state: State;
  dispatch: Action;
}
