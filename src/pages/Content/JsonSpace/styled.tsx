import styled, { css } from 'styled-components';

export const StyledContainer = styled.div<{ isJson: boolean }>`
  height: 100%;
  width: 100%;
  border: 1px solid #c4c4c4;
  box-sizing: border-box;
  position: relative;
  .ant-input {
    display: block;
    position: absolute;
    /* border: 1px solid #1e6fff; */
    font-size: 15px;
    resize: none;
    will-change: transform;
    overflow: hidden;
    z-index: 1;
    width: 100%;
    height: 100%;
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
