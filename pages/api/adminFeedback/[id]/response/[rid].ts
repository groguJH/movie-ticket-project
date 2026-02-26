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

  if (req.method === "POST") {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "답글 내용을 입력해주세요." });
    }
    const updated = await addResponse(id as string, text, AdminName as string);
    return res.status(200).json(updated);
  }

  if (req.method === "PATCH") {
    const patchContext = req.body;
    const updated = await patchFeedbackService(id, patchContext, AdminName);
    return res.status(200).json({ ok: true, data: updated });
  }
  if (req.method === "DELETE") {
    const soft = true;
    await deleteFeedbackService(id, AdminName, soft);
    return res.status(200).json({ ok: true });
  }
  return res.status(405).end();
}
