// 만족도 조사 라디오버튼

import styled from "@emotion/styled";

export const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 4px 0;
  font-size: 14px;

  span {
    color: #f8f8f8;
  }
`;

export const HiddenRadio = styled.input`
  display: none;
`;

export const Circle = styled.div<{ checked: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #888;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s;

  ${({ checked }) =>
    checked &&
    `
      border-color: #f6f1f1;
      background-color: #1677fa;
      box-shadow: 0 0 10px #304be4;
    `}
`;

export interface Props {
  value: string;
  selected: string;
  onChange: (value: string) => void;
}

export default function CustomRadio({ value, selected, onChange }: Props) {
  return (
    <Label onClick={() => onChange(value)}>
      <HiddenRadio
        type="radio"
        checked={selected === value}
        onChange={() => onChange(value)}
      />
      <Circle checked={selected === value} />
      <span>{value}</span>
    </Label>
  );
}
