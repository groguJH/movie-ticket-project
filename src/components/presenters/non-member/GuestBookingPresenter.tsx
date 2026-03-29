import { Form, Input, Button, Typography, Row, Card, Col } from "antd";
import styled from "@emotion/styled";
import { JSX } from "react";
import { NonMemberBookingFormValues } from "../../../../types/nonmember";
import BookingSearchPresenter from "./BookingSearchPresenter";

const { Text } = Typography;

const Warning = styled(Text)`
  display: block;
  margin-top: 1rem;
  color: #999;
`;

interface GuestBookingPresenterProps {
  onCreate: (values: NonMemberBookingFormValues) => void;
  onSearch: (values: NonMemberBookingFormValues) => void;
  loading: boolean;
  upcoming: any[];
  past: any[];
  error: string | null;
  searching: boolean;
}

export function GuestBookingPresenter({
  onCreate,
  onSearch,
  loading,
  upcoming,
  past,
  error,
  searching,
}: GuestBookingPresenterProps): JSX.Element {
  const [form] = Form.useForm();

  const handleCreateClick = async () => {
    const values = await form.validateFields();
    onCreate(values as NonMemberBookingFormValues);
  };

  const handleSearchClick = async () => {
    const values = await form.validateFields();
    onSearch(values as NonMemberBookingFormValues);
  };

  return (
    <div
      style={{
        width: "100%",
        padding: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Card title="비회원 예매 / 조회" style={{ marginBottom: 16, width: "100%" }}>
        <Form form={form} layout="vertical" style={{ width: "100%" }}>
          <Row gutter={12}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="name" label="이름" rules={[{ required: true }]}>
                <Input placeholder="홍길동" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name="birth"
                label="생년월일 (앞 6자리)"
                rules={[{ required: true }]}
              >
                <Input placeholder="900101" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name="phone"
                label="휴대폰번호"
                rules={[{ required: true }]}
              >
                <Input placeholder="01012341234" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name="password"
                label="비밀번호"
                rules={[{ required: true }]}
              >
                <Input.Password placeholder="비밀번호" />
              </Form.Item>
            </Col>
          </Row>
          <Warning
            style={{
              padding: 0,
              marginTop: 0,
              marginBottom: 30,
              textAlign: "center",
            }}
          >
            회원으로 예매하신 내역은 로그인 &gt; 마이페이지 에서 더욱 편리하게
            확인하실 수 있습니다.
          </Warning>
          <Form.Item
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 8,
              alignItems: "center",
              margin: "0",
            }}
          >
            <Button
              type="primary"
              htmlType="button"
              loading={loading}
              onClick={handleCreateClick}
            >
              예매 진행하기
            </Button>

            <Button
              htmlType="button"
              loading={searching}
              onClick={handleSearchClick}
            >
              예매내역 조회
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {(searching || upcoming.length > 0 || past.length > 0) && (
        <BookingSearchPresenter
          loading={searching}
          error={error}
          upcoming={upcoming}
          past={past}
        />
      )}
    </div>
  );
}
