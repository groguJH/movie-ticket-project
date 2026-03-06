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
  res: NextApiResponse
) {
  const { id, rid } = req.query as { id: string; rid: string };

  const session = await getServerSession(req, res, authOptions);
  const AdminName = (session?.user?.name as string) ?? "admin-unknown";

  if (req.method === "POST") {
    const updated = await addResponse(
      id as string,
      req.body,
      AdminName as string
    );
    return res.status(200).json(updated);
  }

  if (req.method === "PATCH") {
    const patchContext = req.body;
    const updated = await patchFeedbackService(
      id,
      { patchContext, AdminName },
      rid
    );
    return res.status(200).json({ ok: true, data: updated });
  }
  if (req.method === "DELETE") {
    const soft = true;
    await deleteFeedbackService(id, rid, soft);
    return res.status(200).json({ ok: true });
  }
  return res.status(405).end();
}
