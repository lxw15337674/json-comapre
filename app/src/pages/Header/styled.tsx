import { Dropdown } from 'antd';
import styled from 'styled-components';

export const Header = styled.div`
  background: #3178c6;
  color: #fff;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
`;

export const Title = styled.div`
  display: inline-block;
  width: 100px;
  font-weight: 600;
`;
export const Options = styled(Dropdown)`
  display: inline-block;
  margin: 0 10px;
  font-weight: 600;
`;
export const OptionButton = styled.span`
  color: #fff;
  cursor: pointer;
`;
