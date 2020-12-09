import React, { useReducer } from 'react';
import Context, { Action, State } from './interface';

const state: State = {
  sourceJson: {
    a1: 2,
    a: '1',
    b: [1, 2, '3', { a: 2 }, [2]],
    c: { a: 2, c: 4 },
  },
  compareJson: {
    a: 2,
    b: { a: 2 },
    c: { c: 4, a: 2 },
    d: [1, 2],
  },
  filterKey: '',
  selectedKeys: {},
  arrayOrderSensitive: true, //匹配时是否对数组顺序敏感
  json: {},
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setSourceJson':
      return { ...state, sourceJson: action.sourceJson };
    case 'setCompareJson':
      return { ...state, compareJson: action.compareJson };
    case 'setSelectedKeys':
      return { ...state, selectedKeys: action.selectedKeys };
    case 'toggleArrayOrderSensitive':
      return { ...state, arrayOrderSensitive: !state.arrayOrderSensitive };
    default:
      throw new Error('Unhandled action type');
  }
};
export function Reducer() {
  return useReducer(reducer, state);
}

export default React.createContext<Partial<Context>>({});
