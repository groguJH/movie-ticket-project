import { message } from "antd";
import {
  FeedbackEntity,
  UpdateFeedbackRequest,
} from "../../../types/feedbackModal";
import {
  createFeedback,
  getFeedback,
  getFeedbackLists,
  updateFeedbackById,
} from "../../repositories/feedback/updateFeedback";

export async function CreateFeedbackService(feedback: any) {
  const { title, content, satisfaction } = feedback;

  if (!title || !content || !satisfaction) {
    throw new Error("모든 필드를 입력해주세요.");
  }

  const res = await createFeedback(feedback);
  return res;
}
/**
 *
 * 피드백 수정 서비스 함수
 * @description
 * - feedbackId와 userId로 피드백을 식별
 * - 만족도는 1~5 사이의 정수여야 합니다
 * - 변경된 내용이 없으면 오류 발생
 * - 최신순 정렬로 페이지네이션 합니다.
 */
export async function UpdateFeedbackService(
  feedbackId: string,
  userId: string,
  satisfaction: string,
  updateData: UpdateFeedbackRequest,
) {
  const feedback = await getFeedback(feedbackId);

  if (!feedback) {
    throw new Error("피드백을 찾을 수 없습니다.");
  }

  if (userId !== feedback.userId) {
    throw new Error("수정 권한이 없습니다.");
  }

  if (updateData.satisfaction !== null) {
    const s = Number(satisfaction);
    if (!Number.isInteger(s) || s < 1 || s > 5) {
      throw new Error("satisfaction 만족도는 1~5 사이의 정수여야 합니다.");
    }
  }

  const Updated =
    (updateData.title && updateData.title !== feedback.title) ||
    (updateData.content && updateData.content !== feedback.content) ||
    (updateData.satisfaction &&
      updateData.satisfaction != feedback.satisfaction);

  if (!Updated) {
    throw new Error("변경된 내용이 없습니다.");
  }

  const success = await updateFeedbackById(feedbackId, updateData);
  if (!success) {
    throw new Error("피드백 수정에 실패했습니다.");
  }
  return { message: "피드백이 수정되었습니다." };
}

// 페이지네이션
export async function getFeedbackService({
  userId,
  page,
  limit,
}: {
  userId: string;
  page: number;
  limit: number;
}) {
  // 기본값 처리
  const currentPage = page > 0 ? page : 1;
  const perPage = limit > 0 ? limit : 10;

  // Repository 호출 (DB 전체 데이터 조회)
  const allFeedbacks = await getFeedbackLists({ userId });

  // 최신순 정렬
  const sorted = allFeedbacks.sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime(),
  );

  const startIndex = (currentPage - 1) * perPage;
  const paginated = sorted.slice(startIndex, startIndex + perPage);

  return {
    page: currentPage,
    limit: perPage,
    total: allFeedbacks.length,
    feedback: paginated,
  };
}
