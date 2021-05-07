import styled, { css } from 'styled-components';

export const StyledContainer = styled.div<{ isJson: boolean }>`
  height: 50%;
  width: 100%;
  border: 1px solid #c4c4c4;
  box-sizing: border-box;
  position: relative;
  overflow: auto;
  .ant-input {
    height: 100%;
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
