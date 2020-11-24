import React, { useContext } from 'react';
import { Header as MainHeader } from './styled';
import Context from '../state';
const Header = () => {
  const context = useContext(Context);
  return <MainHeader>JSON比对</MainHeader>;
};
export default Header;
