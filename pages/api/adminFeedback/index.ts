import { NextApiRequest, NextApiResponse } from "next";
import { findFeedbackQueryService } from "../../../src/services/adminFeedback/FeedbackAdService";

/**
 *관리자의 피드백 목록을 가져오는 API 핸들러
 * @param req
 * @param res
 * @description
 * - Method: GET
 * - Query Parameters:
 * - page?: number - 페이지 번호 (기본값: 1)
 * - limit?: number - 페이지당 항목 수 (기본값: 10)
 * - search?: string - 검색어
 * - Response: { feedbacks: Feedback[], total: number, page: number, limit: number } 피드백 목록 및 페이징 정보
 *  @throws 405 - 허용되지 않은 메서드
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET")
    return res.status(405).end({ message: "허용되지 않은 메서드입니다." });

  try {
    const { page, limit, search } = req.query;
    const q = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      q: Array.isArray(search)
        ? search.join(" ")
        : (search as string | undefined),
    };

    const data = await findFeedbackQueryService(q);

    return res.status(200).json(data);
  } catch (err: any) {
    console.error("/api/adminFeedback라우트에서 발생한 오류", err);
  }
}
