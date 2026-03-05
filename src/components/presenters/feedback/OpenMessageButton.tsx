
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
