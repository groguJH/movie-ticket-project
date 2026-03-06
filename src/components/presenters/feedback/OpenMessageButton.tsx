// antd의 message 컴포넌트를 사용합니다.
// rest props를 받아 Button 컴포넌트에 전달합니다.

import React from "react";
import { SubmitButton } from "../../utils/WriteForm";

interface OpenMessageButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
}

export default function OpenMessageButton({
  onClick,
  children,
  ...rest
}: OpenMessageButtonProps) {
  return (
    <SubmitButton onClick={onClick} {...rest}>
      {children}
    </SubmitButton>
  );
}
