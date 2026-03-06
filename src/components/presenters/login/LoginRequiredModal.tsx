// components/LoginRequiredModal.tsx
import { Modal } from "antd";
import LoginRequiredBanner from "./LoginRequiredBanner";

interface LoginRequiredModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

export default function LoginRequiredModal({
  visible,
  onClose,
  onLoginClick,
}: LoginRequiredModalProps) {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      closable={false}
      maskClosable={true}
      centered
      width={330}
      style={{
        boxShadow: "0 6px 20px rgb(133, 128, 128)",
        borderRadius: 5,
        backgroundColor: "transparent",
        padding: 0,
        overflow: "hidden",
      }}
      transitionName="fade-slide-up"
    >
      <LoginRequiredBanner onLoginClick={onLoginClick} />
    </Modal>
  );
}
