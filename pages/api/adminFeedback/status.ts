import { NextApiRequest, NextApiResponse } from "next";
import { getFeedbackStatusStats } from "../../../src/repositories/feedbackAdmin/FeedbackAdRepository";
import { requireAdminApi } from "../../../lib/requireAdminApi";

/**
 * 피드백 상태를 통계로 반환하는 API 핸들러
 * @param req
 * @param res
 * @description
 * - Method: GET
 *   - Response: { [status: string]: number } 피드별 갯수를 반환합니다.
 *
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return requireAdminApi(req, res, async () => {
    const status = await getFeedbackStatusStats();
    return res.status(200).json(status);
  });
}
