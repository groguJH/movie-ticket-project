import { NextApiRequest, NextApiResponse } from "next";
import addResponse from "../../../../../src/services/adminFeedback/FeedbackAdService";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";

/**
 * 관리자의 답글 생성하는 핸들러
 * @param req
 * @param res
 */

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "유효한 피드백 ID가 필요합니다." });
  }

  const session = await getServerSession(req, res, authOptions);
  if (session?.user?.role !== "admin") {
    return res.status(403).json({ message: "접근 권한이 없습니다." });
  }
  const adminName = session?.user?.name as string;

  try {
    const { text } = req.body ?? {};

    if (req.method === "POST") {
      if (!text || typeof text !== "string" || text.trim() === "") {
        return res.status(400).json({ message: "답글 내용을 입력해주세요." });
      }
      const result = await addResponse(id as string, text.trim(), adminName);
      return res.status(200).json(result);
    }

    return res.status(405).json({ message: "허용되지 않은 메서드입니다." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}
