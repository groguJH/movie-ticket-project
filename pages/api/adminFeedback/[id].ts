import { NextApiRequest, NextApiResponse } from "next";
import {
  getFeedbackByIdService,
  updateFeedbackStatusService,
} from "../../../src/services/adminFeedback/FeedbackAdService";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
/**
 * @param req
 * @param res
 * @description
 *  모달로 받는 관리자 전용 상세API라우트
 *  GET으로 특정 게시글 전체 조회
 *  PATCH로 게시글의 처리 상태를 변경합니다.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;
  const session = await getServerSession(req, res, authOptions);
  const AdminName = session?.user?.name as string;

  if (session?.user?.role !== "admin") {
    return res.status(403).json({ message: "접근 권한이 없습니다." });
  }

  if (req.method == "GET") {
    const data = await getFeedbackByIdService(id as string);
    return res.status(200).json(data);
  }

  if (req.method == "PATCH") {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status 값이 필요합니다." });
    }
    const updated = await updateFeedbackStatusService(
      id as string,
      status,
      AdminName,
    );
    return res.status(200).json(updated);
  }
  return res.status(405).end();
}
