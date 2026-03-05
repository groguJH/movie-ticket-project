import { useState, useEffect } from "react";
import { Button, Checkbox, Divider, Form, Input, Typography } from "antd";
import { MyInfoEditPresenterProps } from "../../../../types/user";
import { useSession } from "next-auth/react";
import Image from "next/image";

const { Title, Text } = Typography;

const profileImages = [
  { label: "강아지", value: "profile_dog", url: "/profile_dog.png" },
  { label: "고양이", value: "profile_cat", url: "/profile_cat.png" },
  { label: "남성", value: "profile_man", url: "/profile_man.png" },
  { label: "여성", value: "profile_woman", url: "/profile_woman.png" },
];

export default function EditProfilePresenter({
  initialValues,
  onSubmit,
}: MyInfoEditPresenterProps) {
  const [form] = Form.useForm();
  const sessionName = useSession().data?.user?.name || "사용자";

  const [selectedProfile, setSelectedProfile] = useState(initialValues.image);
  const isSocialUser =
    initialValues?.logging === "kakao" || initialValues?.logging === "naver";

  useEffect(() => {
    form.setFieldsValue({ profileImage: selectedProfile });
  }, [selectedProfile, form]);

  const whiteLabel = (text: string) => (
    <span style={{ color: "white" }}>{text}</span>
  );

  const rulesDocs = isSocialUser
    ? []
    : [{ required: true, message: "필수 입력값입니다!" }];

  const handleFinish = (values: any) => {
    onSubmit({ ...initialValues, ...values, image: selectedProfile });
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <Title level={2} style={{ color: "white" }}>
        개인정보 수정
      </Title>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleFinish}
        initialValues={{ ...initialValues }}
      >
        {/* 프로필 이미지 선택 */}
        <Form.Item label={whiteLabel("프로필 사진")} name="profileImage">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 20,
              marginBottom: 20,
            }}
          >
            {profileImages.map((img) => (
              <div
                key={img.value}
                onClick={() => setSelectedProfile(img.value)}
                style={{
                  width: 72,
                  height: 72,
                  border:
                    selectedProfile === img.value
                      ? "4px solid #1890ff"
                      : "2px solid white",
                  borderRadius: "50%",
                  padding: 4,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                }}
              >
                <Image
                  src={img.url}
                  alt={img.label}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </div>
          <Form.Item name="profileImage" initialValue={selectedProfile} hidden>
            <Input type="hidden" />
          </Form.Item>
        </Form.Item>

        {/* 일반 로그인 사용자 전용 필드 */}
        <div
          style={{
            pointerEvents: isSocialUser ? "none" : "auto",
            opacity: isSocialUser ? 0.5 : 1,
            filter: isSocialUser ? "blur(1px)" : "none",
            transition: "all 0.3s ease",
          }}
        >
          <Form.Item label={whiteLabel("이메일")} name="newEmail">
            <Input placeholder="이메일을 입력하세요" />
          </Form.Item>

          <Form.Item
            label={whiteLabel("비밀번호")}
            name="password"
            rules={rulesDocs}
          >
            <Input.Password placeholder="비밀번호를 입력하세요" />
          </Form.Item>

          <Form.Item label={whiteLabel("이름")} name="name" rules={rulesDocs}>
            <Input placeholder="이름" />
          </Form.Item>

          <Form.Item label={whiteLabel("전화번호")} name="phone">
            <Input placeholder="전화번호를 입력하세요" />
          </Form.Item>
        </div>

        {isSocialUser && (
          <Text style={{ color: "#ffaaaa", display: "block", marginTop: 10 }}>
            소셜 로그인 사용자는 이름, 이메일, 전화번호, 비밀번호를 수정할 수
            없습니다.
          </Text>
        )}

        <Divider style={{ borderColor: "white", marginTop: "35px" }} />

        {/* 마케팅 동의 */}
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <Title level={5} style={{ color: "white", marginBottom: 10 }}>
            마케팅 활용 동의 및 광고 수신 동의
          </Title>
          <Text
            style={{
              color: "#ffffffcc",
              fontSize: "14px",
              display: "block",
              marginBottom: 15,
            }}
          >
            서비스와 관련된 신상품 소식, 이벤트 안내, 고객 혜택 등 다양한 정보를
            제공합니다.
          </Text>

          <Form.Item
            name="agreeSms"
            valuePropName="checked"
            style={{ marginBottom: 0 }}
          >
            <Checkbox style={{ color: "#ffffffcc" }}>SMS 수신 동의</Checkbox>
          </Form.Item>

          <Form.Item
            name="agreeEmail"
            valuePropName="checked"
            style={{ marginBottom: 8 }}
          >
            <Checkbox style={{ color: "#ffffffcc" }}>E-Mail 수신 동의</Checkbox>
          </Form.Item>
        </div>

        <Form.Item>
          <Button type="default" htmlType="reset" block>
            입력 초기화
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ marginTop: 15 }}
          >
            개인정보 변경
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
