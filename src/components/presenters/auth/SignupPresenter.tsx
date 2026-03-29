import React from "react";
import { Form, Input, Button, Typography, Divider } from "antd";
import { BasicSignupValues } from "../../../containers/auth/SignupContainer";

const { Title } = Typography;

interface SignupPresenterProps {
  onKakaoSignup: () => void;
  onNaverSignup: () => void;
  onBasicSignup: (values: BasicSignupValues) => void;
}

const SignupPresenter: React.FC<SignupPresenterProps> = ({
  onKakaoSignup,
  onNaverSignup,
  onBasicSignup,
}) => {
  const whiteLabel = (text: string) => (
    <span style={{ color: "white" }}>{text}</span>
  );

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 500,
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <Title
        level={2}
        style={{ color: "white", marginTop: 40, marginBottom: 32 }}
      >
        회원가입
      </Title>
      <Form
        layout="vertical"
        onFinish={onBasicSignup}
        style={{ width: "100%" }}
      >
        <Form.Item
          label={whiteLabel("이메일")}
          name="email"
          style={{ width: "100%" }}
          rules={[
            { required: true, message: "이메일을 입력해주세요!" },
            { type: "email", message: "유효한 이메일을 입력해주세요!" },
          ]}
        >
          <Input placeholder="example@mail.com" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label={whiteLabel("비밀번호")}
          name="password"
          style={{ width: "100%" }}
          rules={[{ required: true, message: "비밀번호를 입력해주세요!" }]}
        >
          <Input.Password placeholder="비밀번호" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label={whiteLabel("비밀번호 확인")}
          name="confirmPassword"
          style={{ width: "100%" }}
          dependencies={["password"]}
          rules={[
            { required: true, message: "비밀번호 확인을 입력해주세요!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("비밀번호가 일치하지 않습니다!"),
                );
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="비밀번호 확인"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label={whiteLabel("이름")}
          name="name"
          style={{ width: "100%" }}
          rules={[{ required: true, message: "이름을 입력해주세요!" }]}
        >
          <Input placeholder="이름" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label={whiteLabel("전화번호")}
          name="phone"
          style={{ width: "100%" }}
        >
          <Input placeholder="전화번호" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item style={{ width: "100%" }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ width: "100%" }}
          >
            회원가입
          </Button>
        </Form.Item>

        <Form.Item>
          <Divider style={{ color: "white", margin: "24px 0 12px 0" }}>
            또는 소셜 계정으로 회원가입
          </Divider>
        </Form.Item>

        <Form.Item>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <Button
              type="primary"
              block
              style={{
                backgroundColor: "#FEE500",
                borderColor: "#FEE500",
                color: "black",
              }}
              onClick={onKakaoSignup}
            >
              카카오로 회원가입
            </Button>
            <Button
              type="primary"
              block
              style={{
                backgroundColor: "#03C75A",
                borderColor: "#03C75A",
                color: "black",
              }}
              onClick={onNaverSignup}
            >
              네이버로 회원가입
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignupPresenter;
