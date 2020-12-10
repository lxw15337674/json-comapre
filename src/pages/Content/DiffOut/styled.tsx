import styled, { css } from 'styled-components';
import { Status } from '../../../common/utils/interface';

export const StyledContainer = styled.div<{ isJson: boolean }>`
  height: 100%;
  width: 100%;
  border: 1px solid #c4c4c4;
  box-sizing: border-box;
  position: relative;
  .ant-input {
    height: 50%;
    overflow: scroll;
    display: block;
    position: absolute;
    background-color: transparent;
    font-size: 15px;
    resize: none;
    will-change: transform;
    width: 100%;
    box-sizing: border-box;
    ${(props) =>
      !props.isJson &&
      css`
        color: red;
      `}
  }
`;
export const StyledPre = styled.div`
  border: 1px solid #c5d8db;
  box-sizing: border-box;
`;

export const HalfHightDiv = styled.div`
  height: 50%;
  overflow: scroll;
  display: flex;
`;

export const ViewLine = styled.div`
  line-height: 25px;
  font-size: 15px;
  border-bottom: 0.5px solid #bbc;
  ${({ status }: { status?: Status }) => {
    switch (status) {
      case '=':
        return '';
      case '+':
        return `
        background: green;
        color:white
        `;
      case '-':
        return `
        background:rgb(158, 158, 0);
        color:white
        
        `;
      case 'D':
        return `
        background:red;
        color:white
        `;
      default:
        return '';
    }
  }}
`;

export const LineStatus = styled(ViewLine)`
  width: 50px;
  padding-left: 5px;
`;

export const NumberLineContainer = styled.div`
  height: 100%;
  width: 50px;
  border-right: 1px solid #ddd;
  user-select: none;
  color: #999;
`;

export const JsonContainer = styled.div`
  margin-left: 10px;
  width: 50%;
  border: 1px solid #bbc;
`;

export const StyledInputDiv = styled.div`
  display: flex;
  position: fixed;
  bottom: 200px;
  left: 50%;
  height: 40px;
  width: 100px;
  z-index: 10001;
  transform: translateX(-50%);
  box-shadow: 0 2px 8px #a8a8a8;
  .ant-input {
    height: 100%;
  }
`;
