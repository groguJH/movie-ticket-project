import { FeedbackListResponse } from "../../types/feedbackModal";

export default async function fetchPost(
  page: number,
  limit: number
): Promise<FeedbackListResponse> {
  const res = await fetch(`/api/profile/feedback?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("피드백 조회 실패");
  const data = await res.json();
  return data as FeedbackListResponse;
}
