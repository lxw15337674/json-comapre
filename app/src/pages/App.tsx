import Header from './Header';
import Content from './Content';
import React from 'react';
import Context, { Reducer } from './state';
const App = () => {
  const [state, dispatch] = Reducer();
  return (
    <Context.Provider value={{ state, dispatch }}>
      <div className='App'>
        <Header></Header>
        <Content></Content>
      </div>
    </Context.Provider>
  );
};

export default App;
