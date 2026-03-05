import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { message } from "antd";
import { useEffect, useState } from "react";
import EditProfilePresenter from "../../components/presenters/profile/EditProfilePresenter";
import { updateEditProfileParams } from "../../../types/user";

/**
 * 프로필 수정 컨테이너 컴포넌트
 * @description
 * 1. NextAuth의 세션 정보를 사용하여 초기 폼 값 설정합니다.
 * 2. 사용자가 프로필 수정 폼을 제출하면 API로 수정 요청 전송
 * 3. 수정 성공 시 NextAuth 세션 정보를 갱신하고 홈으로 리다이렉트
 * 4. 수정 실패 시 에러 메시지를 표시
 */

export default function EditProfileContainer() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [initialValues, setInitialValues] =
    useState<updateEditProfileParams | null>(null);

  useEffect(() => {
    if (session?.user) {
      const oldEmail = session.user.email || "";
      const logging = session.user.provider || null;

      setInitialValues({
        oldEmail,
        newEmail: oldEmail,
        name: session.user.name || "",
        phone: "",
        password: "",
        agreeSms: false,
        agreeEmail: false,
        image: session.user.image || "profile_dog",
        logging,
      });
    }
  }, [session]);

  const handleSubmit = async (values: updateEditProfileParams) => {
    const isSocialUser =
      values.logging === "kakao" || values.logging === "naver";

    const commonBody = {
      profileImage: values.image,
      agreeSms: values.agreeSms,
      agreeEmail: values.agreeEmail,
    };

    const fullBody = isSocialUser
      ? commonBody
      : {
          ...commonBody,
          oldEmail: values.oldEmail,
          newEmail: values.newEmail,
          name: values.name,
          phone: values.phone,
          password: values.password,
        };

    try {
      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fullBody),
      });

      if (res.ok) {
        const updateSessionData = isSocialUser
          ? {
              image: values.image,
            }
          : {
              name: values.name,
              image: values.image,
              email: values.newEmail,
            };
        await update(updateSessionData);

        setTimeout(() => {
          messageApi.success("개인정보가 성공적으로 수정되었습니다.");
          router.push("/");
        }, 500);
      } else {
        const err = await res.json();
        messageApi.error(err.message || "수정에 실패했습니다.");
      }
    } catch (error) {
      messageApi.error("오류가 발생했습니다.");
      console.error(error);
    }
  };

  if (!initialValues) return null;

  return (
    <>
      {contextHolder}
      <EditProfilePresenter
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </>
  );
}
