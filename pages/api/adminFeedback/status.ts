import { NextApiRequest, NextApiResponse } from "next";
import { getFeedbackStatusStats } from "../../../src/repositories/feedbackAdmin/FeedbackAdRepository";
import { requireAdminApi } from "../../../lib/requireAdminApi";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

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
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);
  const AdminName = (session?.user?.name as string) ?? "admin-unknown";

  if (req.method !== "GET")
    return res.status(405).json({ message: "허용되지 않은 메서드입니다." });

  if (session?.user?.role !== "admin") {
    return res.status(403).json({ message: "접근 권한이 없습니다." });
  }

  return requireAdminApi(req, res, async () => {
    const status = await getFeedbackStatusStats();
    return res.status(200).json(status);
  });
}
