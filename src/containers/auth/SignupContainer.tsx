"use client";
import React from "react";
import { signIn } from "next-auth/react";
import SignupPresenter from "../../components/presenters/auth/SignupPresenter";
import { useRouter } from "next/router";
import { App } from "antd";
import { message } from "antd";

export interface BasicSignupValues {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone?: string;
}

/**
 * 회원가입 컨테이너 컴포넌트
 * @returns {JSX.Element}
 * @description
 * 1. 카카오, 네이버 소셜 로그인을 처리하는 핸들러를 정의합니다.
 * 2. 기본 회원가입 폼 제출 시 API로 회원가입 요청을 보내는 핸들러를 정의합니다.
 * 3. SignupPresenter 컴포넌트에 각 핸들러를 props로 전달하여 UI 렌더링합니다.
 *
 */
const SignupContainer: React.FC = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const handleKakaoSignup = () => {
    signIn("kakao", {
      callbackUrl: "http://localhost:3000/mypage",
      redirect: true,
      popupOptions: { width: 600, height: 700 },
    });
  };

  const handleNaverSignup = () => {
    signIn("naver", {
      callbackUrl: "http://localhost:3000/mypage",
      redirect: true,
    });
  };

  const handleBasicSignup = async (values: BasicSignupValues) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        messageApi.open({
          type: "success",
          content: "회원가입에 성공했습니다.",
        });

        router.push("/mypage");
        return;
      } else {
        const errorData = await res.json();
        messageApi.open({
          type: "error",
          content: "회원가입에 실패했습니다.",
        });
        `회원가입 실패: ${errorData.error}`;
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
      messageApi.open({
        type: "error",
        content: "회원가입 도중 오류가 발생했습니다.",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <SignupPresenter
        onKakaoSignup={handleKakaoSignup}
        onNaverSignup={handleNaverSignup}
        onBasicSignup={handleBasicSignup}
      />
    </>
  );
};

export default SignupContainer;
