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

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "유효한 피드백 ID가 필요합니다." });
  }

  if (req.method !== "GET" && req.method !== "PATCH") {
    return res.status(405).end();
  }

  try {
    if (req.method === "GET") {
      const data = await getFeedbackByIdService(id);
      if (!data) {
        return res.status(404).json({ message: "피드백을 찾을 수 없습니다." });
      }
      return res.status(200).json(data);
    }

    const { status } = req.body ?? {};
    const allowedStatus = ["before reply", "resolved", "in_progress"] as const;

    if (!status || typeof status !== "string") {
      return res.status(400).json({ message: "status 값이 필요합니다." });
    }
    if (!allowedStatus.includes(status as (typeof allowedStatus)[number])) {
      return res.status(400).json({ message: "허용되지 않은 status 값입니다." });
    }

    const updated = await updateFeedbackStatusService(
      id,
      status as (typeof allowedStatus)[number],
      AdminName,
    );
    return res.status(200).json(updated);
  } catch (error: any) {
    if (error.name === "BSONError" || error.name === "CastError") {
      return res.status(400).json({ message: "유효하지 않은 ID 형식입니다." });
    }
    if (error instanceof Error && error.message.includes("허용되지 않은 status")) {
      return res.status(400).json({ message: error.message });
    }
    if (error instanceof Error && error.message.includes("찾을 수 없습니다")) {
      return res.status(404).json({ message: error.message });
    }
    console.error("관리자 피드백 상세 처리 실패:", error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}
