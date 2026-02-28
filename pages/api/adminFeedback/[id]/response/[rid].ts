import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";
import addResponse, {
  deleteFeedbackService,
  patchFeedbackService,
} from "../../../../../src/services/adminFeedback/FeedbackAdService";

/**
 * 관리자의 답글 수정/삭제 핸들러
 * @param req
 * @param res
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id, rid } = req.query as { id: string; rid: string };

  const session = await getServerSession(req, res, authOptions);
  const AdminName = (session?.user?.name as string) ?? "admin-unknown";

  if (session?.user?.role !== "admin") {
    return res.status(403).json({ message: "접근 권한이 없습니다." });
  }

  if (!rid) {
    return res.status(400).json({ message: "답글 ID(rid)가 필요합니다." });
  }

  if (req.method === "PATCH") {
    const { text } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ message: "답글을 올바르게 입력해주세요." });
    }
    try {
      await patchFeedbackService(id, rid, { text: text.trim() }, AdminName);
      return res.status(200).json({ ok: true });
    } catch (error: any) {
      if (error.name === "BSONError" || error.name === "CastError") {
        return res
          .status(400)
          .json({ message: "유효하지 않은 ID 형식입니다." });
      }
      return res
        .status(500)
        .json({ message: "서버 내부 오류로 수정에 실패했습니다." });
    }
  }

  if (req.method === "DELETE") {
    const isSoft = true;

    try {
      await deleteFeedbackService(id, rid, AdminName, isSoft);
      return res.status(200).json({ ok: true });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "삭제 처리 중 오류가 발생했습니다." });
    }
  }
  return res.status(405).end();
}
