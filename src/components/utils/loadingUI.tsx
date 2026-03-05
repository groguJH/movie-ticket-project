import React from "react";
import { App, Button, Empty, Spin } from "antd";
import styled from "@emotion/styled";

export function FullPageSkeleton() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin size="large" />
    </div>
  );
}

export function ListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
        gap: 16,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{ padding: 12, borderRadius: 8, background: "#f3f3f3" }}
        >
          <div
            style={{
              width: "100%",
              height: 120,
              background: "#e6e6e6",
              borderRadius: 6,
            }}
          />
          <div
            style={{
              height: 12,
              width: "70%",
              background: "#e6e6e6",
              marginTop: 12,
            }}
          />
          <div
            style={{
              height: 10,
              width: "40%",
              background: "#e6e6e6",
              marginTop: 8,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export const ButtonBlock = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: disabled;
`;

export function InlineSmallSpinner() {
  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <Spin />
    </div>
  );
}

export function ErrorToast(text: string) {
  const { message } = App.useApp();
  message.error(text);
}

export const EmptyMessage = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 200px;
  text-align: center;
  color: #888;
`;

export const ItemBlock = styled.div`
  cursor: none;
  display: inline-block;
  background-color: #333;
  width: 60px;
  height: 20px;

  border-radius: 4px; /* 모서리 둥글게 */
  margin: 0 10px; /* 좌우 간격 */

  /* 스켈레톤 애니메이션 효과 (선택 사항) */
  animation: skeleton-glow 1.5s infinite ease-in-out;
  @keyframes skeleton-glow {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }
`;

export const EmptyMovieList = () => {
  return (
    <div style={{ padding: "60px 0", textAlign: "center" }}>
      <Empty
        description={
          <>
            <div>현재 상영/방영중인 컨텐츠가 아닙니다.</div>
            <div style={{ marginTop: 8 }}>
              다음에 더 좋은 컨텐츠를 준비하겠습니다
            </div>
          </>
        }
      />
      <Button
        type="primary"
        onClick={() => history.back()}
        style={{ marginTop: 24 }}
      >
        이전으로 돌아가기
      </Button>
    </div>
  );
};
