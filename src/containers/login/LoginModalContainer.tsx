import React, { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import LoginModal, {
  LoginFormValues,
} from "../../components/presenters/login/LoginModal";

/**
 * 로그인 모달 컨테이너 컴포넌트
 * @props { onClose: () => void } onClose - 모달 닫기 핸들러
 * @description
 * 1. 사용자가 로그인 폼을 제출하면 NextAuth의 signIn 함수를 호출하여 인증 처리
 * 2. 인증 실패 시 에러 메시지를 상태로 관리하여 LoginModal에 전달
 * 3. 인증 성공 시 모달을 닫고 마이페이지로 리다이렉트
 */

interface Props {
  onClose: () => void;
  onNonMemberBooking: () => void;
}

export default function LoginModalContainer({ onClose }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (values: LoginFormValues) => {
    setError(null);
    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (res?.error) {
      setError("아이디 또는 비밀번호가 맞지 않습니다. 다시 확인해주세요.");
    } else {
      // 로그인 성공
      onClose(); // 모달 닫고
      router.push("/mypage");
    }
  };

  function onNonMemberBooking() {
    onClose();
    router.push({
      pathname: "/non-member",
      query: { returnTo: router.asPath },
    });
  }
  return (
    <>
      <LoginModal
        open={true} // 항상 열려 있다 보고
        onClose={onClose}
        onLogin={handleLogin}
        error={error}
        onNonMemberBooking={onNonMemberBooking}
      />
    </>
  );
}
