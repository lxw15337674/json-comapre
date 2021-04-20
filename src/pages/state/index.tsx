import React, { useMemo, useReducer } from 'react';
import Context, { Action, State, Types } from './interface';

const initState: State = {
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

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Types.SetSourceJson:
      return { ...state, sourceJson: action.sourceJson };
    case Types.SetCompareJson:
      return { ...state, compareJson: action.compareJson };
    case Types.SetSelectedKeys:
      return { ...state, selectedKeys: action.selectedKeys };
    case Types.ToggleArrayOrderSensitive:
      return { ...state, arrayOrderSensitive: !state.arrayOrderSensitive };
    case Types.Reset:
      return initState;
    default:
      throw new Error('Unhandled action type');
  }
};

const getState = () => {
  let state = initState;
  let cache = localStorage.getItem('state');
  if (cache) {
    state = JSON.parse(cache);
  }
  return state;
};

const cacheState = (state: State, action: Action): State => {
  const res = reducer(state, action);
  localStorage.setItem('state', JSON.stringify(res));
  return res;
};

export function Reducer(): [State, React.Dispatch<Action>] {
  const state = useMemo(() => getState(), []);
  return useReducer(cacheState, state);
}
export default React.createContext<Partial<Context>>({});
