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
  width: 100%;
  height: 25px;
  border-bottom: 0.5px solid #f0f0f0;
  ${({ status }: { status?: Status }) => {
    switch (status) {
      case '=':
        return '';
      case '+':
        return `
        background: rgba(51,255,51,0.1);
        `;
      case 'D':
        return `
        background:#f5b02766;
        `;
      case '-':
        return `
        background:#ff2f0066;
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
  width: 40%;
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
