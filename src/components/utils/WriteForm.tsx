import styled from "@emotion/styled";
import { Radio } from "antd";

export const Wrapper = styled.section`
  max-width: 80vw;
  width: 100%;
  margin: 0 auto;
  padding: 32px 16px;
  background-color: none;

  h2 {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  svg {
    padding-top: 2px;
  }

  @media (min-width: 768px) {
    /* padding: 32px 24px; */
  }
`;

export const Title = styled.h2`
  margin: 0 0 32px 0;
`;

export const Form = styled.form`
  max-width: 950px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #f8f8f8;
`;

export const Label = styled.label`
  display: block;
  width: 100%;
  padding: 1rem 0;
  span {
    font-weight: bold;
  }
`;

export const SatisfactionLabel = styled.label`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 1rem 0;
  gap: 24px;
  span {
    font-weight: normal;
    color: #f8f8f8;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 2.5;
  border: none;
  padding: 0.5rem;
  margin-top: 0.5rem;
  outline: none;
  &:focus {
    box-shadow: 0 0 10px #304be4;
  }
`;

export const StyledRadioGroup = styled.div``;

export const Textarea = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 0.5rem;
  margin-top: 0.5rem;
  resize: none;
  outline: none;
  &:focus {
    box-shadow: 0 0 10px #304be4;
  }
`;

export const SubmitButton = styled.button`
  padding: 8px 16px;
  background: #0070f3;
  color: #f6f1f1;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #0051cc;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
  }
  &:active {
    text-shadow: none;
    box-shadow: 0 0 #0051cc;
    background: #003399;
  }
`;
