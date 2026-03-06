// components/auth/LoginModal.tsx
"use client";
import { Form, Input, Button, Modal, Typography } from "antd";
import styled from "@emotion/styled";
import { signIn } from "next-auth/react";

const { Text } = Typography;

const TitleHeader = styled.div`
  width: 100%;
  background-color: #f38e12;
  color: white;
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 8px 8px 0 0;
`;

// Divider 스타일
const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #444;
  }
  &::before {
    margin-right: 10px;
  }
  &::after {
    margin-left: 10px;
  }
`;

const OrText = styled.span`
  color: #aaa;
  font-size: 13px;
`;

const SocialButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 38px;
  margin-bottom: 10px;
  font-weight: 500;
  font-size: 14px;
  border-radius: 4px;
`;

const KakaoButton = styled(SocialButton)`
  background-color: #fee500;
  color: #000;
  border: none;
`;

const NaverButton = styled(SocialButton)`
  background-color: #03c75a;
  color: white;
  border: none;
`;

const DefaultLoginButton = styled(SocialButton)`
  background-color: #666;
  color: white;
  border: none;
`;

export interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (values: LoginFormValues) => void;
  error?: string | null;
  onNonMemberBooking: () => void;
}

export default function LoginModal({
  open,
  onClose,
  onLogin,
  error,
  onNonMemberBooking,
}: LoginModalProps) {
  return (
    <Modal
      title={<TitleHeader>로그인</TitleHeader>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={350}
      style={{
        borderRadius: "5px",
        padding: "10px",
      }}
      centered
    >
      {error && (
        <Text type="danger" style={{ display: "block", marginBottom: 16 }}>
          {error}
        </Text>
      )}
      <Form<LoginFormValues>
        layout="vertical"
        onFinish={onLogin}
        style={{ padding: "0.1px 10px" }}
      >
        <Form.Item
          label={<span style={{ color: "#fff" }}>이메일</span>}
          name="email"
          rules={[
            { required: true, message: "이메일을 입력하세요!" },
            { type: "email", message: "유효한 이메일을 입력해주세요!" },
          ]}
        >
          <Input placeholder="example@mail.com" />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "#fff" }}>비밀번호</span>}
          name="password"
          rules={[{ required: true, message: "비밀번호를 입력해주세요!" }]}
        >
          <Input.Password placeholder="비밀번호를 입력해주세요" />
        </Form.Item>

        <Divider>
          <OrText>OR</OrText>
        </Divider>

        <KakaoButton block onClick={() => signIn("kakao")}>
          <img src="/kakao_button.png" alt="kakao" width={18} height={18} />
          카카오 로그인
        </KakaoButton>

        <NaverButton block onClick={() => signIn("naver")}>
          <img src="/naver_button.png" alt="naver" width={18} height={18} />
          네이버 로그인
        </NaverButton>

        <DefaultLoginButton block htmlType="submit">
          로그인
        </DefaultLoginButton>
        <DefaultLoginButton block onClick={() => onNonMemberBooking()}>
          비회원 예매확인
        </DefaultLoginButton>
      </Form>
    </Modal>
  );
}
