import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import WriteListPresent from "../../../components/presenters/feedback/WriteListPresent";
import { useMutation } from "@tanstack/react-query";
import { message, RadioChangeEvent } from "antd";
import { FeedbackRequest } from "../../../../types/feedbackModal";

// 로그인 정보(세션) 상태를 통해 회원의 ID를 가져옵니다.
// 제목 내용이 하나의 useState 로 관리됩니다.
// 작성 완료 버튼 클릭 시, 작성된 피드백을 서버로 전송합니다.

export default function WriteContainer() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { data: session } = useSession();
  const [satisfaction, setSatisfaction] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();

  const router = useRouter();
  const userName = session?.user?.name ?? "Guest";
  const userId = session?.user?.id ?? "unknown";
  const key = "writeButton";

  const mutation = useMutation({
    mutationFn: ({ title, content, satisfaction }: FeedbackRequest) =>
      fetch("/api/profile/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          satisfaction,
        }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error("피드백 작성에 실패했습니다.");
        }
      }),

    onError: (error: any) => {
      // alert(error.message);
      messageApi.error(error.message);
    },

    onSuccess: () => {
      // 1) 로딩 메세지
      messageApi.open({
        key,
        type: "loading",
        content: "피드백 작성 중...",
      });

      // 2) 성공 메시지로 변경
      setTimeout(() => {
        messageApi.open({
          key,
          type: "success",
          content: "피드백이 성공적으로 작성되었습니다!",
          duration: 2,
        });

        // 3) 성공 메시지가 끝난 뒤 이동
        setTimeout(() => {
          router.push("/mypage/feedback");
        }, 2000);
      }, 500);
    },
  });

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!session) return messageApi.warning("로그인이 필요합니다.");
    if (!title.trim() || !content.trim())
      return messageApi.warning("제목과 내용을 모두 입력해주세요.");
    mutation.mutate({
      title: title.trim(),
      content: content.trim(),
      satisfaction: satisfaction.trim(),
    });
  };

  const onChangeRadio = (e: RadioChangeEvent) => {
    setSatisfaction(e.target.value);
  };

  return (
    <>
      {contextHolder}
      <WriteListPresent
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        onSubmit={handleSubmit}
        satisfaction={satisfaction}
        setSatisfaction={setSatisfaction}
        userName={userName} // 사용자 ID를 전달합니다.
        isPending={mutation.isPending} // loading = pending
        isError={mutation.isError}
      />
    </>
  );
}
