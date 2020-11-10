import { hot } from 'react-hot-loader/root';
import React from 'react';
import Header from './Header';
import Content from './Content';
import './reset.css';

import './../assets/scss/App.scss';

const App = () => {
  return (
    <div className='App'>
      <Header></Header>
      <Content></Content>
    </div>
  );
};

export default hot(App);
