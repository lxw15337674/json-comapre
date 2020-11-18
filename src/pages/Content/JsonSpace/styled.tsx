import styled, { css } from 'styled-components';

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
    /* border: 1px solid #1e6fff; */
    background-color: transparent;
    font-size: 15px;
    resize: none;
    will-change: transform;
    width: 100%;
    box-sizing: border-box;
    /* &:focus {
      outline-color: #1e6fff;
    } */
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
  letter-spacing: 1px;
`;

export const DiffDiv = styled(ViewLine)`
  color: red;
`;

export const AddDiv = styled(ViewLine)`
  color: green;
`;
export const ReduceDiv = styled(ViewLine)`
  color: rgb(158, 158, 0);
`;
export const EqDiv = styled(ViewLine)``;

export const LineStatus = styled(ViewLine)`
  width: 40px;
  padding-left: 5px;
`;

export const NumberLineContainer = styled.div`
  height: 100%;
  width: 40px;
  border-right: 1px solid #ddd;
  user-select: none;
  color: #999;
`;

export const JsonContainer = styled.div`
  margin-left: 10px;
`;
