import React, { useReducer } from 'react';
import { Action, State } from './interface';

const state: State = {
  sourceJson: `{
        "total_rewards_count":0
      }`,
  compareJson: `{
        "total_rewards_count":0
      }`,
  filterKey: '',
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setSourceJson':
      state.sourceJson = action.sourceJson;
      return { ...state, sourceJson: action.sourceJson };
    case 'setCompareJson':
      state.compareJson = action.compareJson;
      return { ...state, compareJson: action.compareJson };
    default:
      throw new Error('Unhandled action type');
  }
};
export function Reducer() {
  return useReducer(reducer, state);
}

export default React.createContext({});
