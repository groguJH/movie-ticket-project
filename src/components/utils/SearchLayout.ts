import styled from "@emotion/styled";

export const SearchWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: visible;
  top: 80px;
  left: 0;
  width: 100%;
  height: 20rem;
  padding: 0 16px;
  z-index: 1000;
  background-color: black;
`;

export const Wrapper = styled.div`
  position: relative;
  width: 400px;
`;

export const ResultList = styled.li`
  position: absolute;
  top: calc(100% + 4px); /* input 높이만큼 내려서 붙임 */
  width: 100%;
  z-index: 9999;
  background-color: white;
  max-height: 1200px;
  overflow-y: hidden;
  z-index: 5;
  margin: 0;
  padding: 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: black;
  list-style-type: none;
`;

export const ResultItem = styled.ul`
  list-style-type: none;
  cursor: pointer;
  transition: background 0.2s;
  margin: 0;
  padding: 8px 16px;
  &:hover {
    background-color: #f0f0f0;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5rem;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
  size: large;
  z-index: 10;

  &:focus {
    outline: none;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 8px;
  }
`;
