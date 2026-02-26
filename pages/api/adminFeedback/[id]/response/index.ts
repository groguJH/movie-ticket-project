import { NextApiRequest, NextApiResponse } from "next";
import addResponse, {
  deleteFeedbackService,
} from "../../../../../src/services/adminFeedback/FeedbackAdService";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";

/**
 * 관리자의 답글 추가 핸들러
 * @param req
 * @param res
 */

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { text } = req.body;

  // 2. 세션 및 권한 체크
  const session = await getServerSession(req, res, authOptions);
  if (session?.user?.role !== "admin") {
    return res.status(403).json({ message: "접근 권한이 없습니다." });
  }
  const adminName = session?.user?.name as string;

  // 3. 메서드별 로직 분기
  try {
    if (req.method === "POST") {
      const result = await addResponse(id as string, text, adminName);
      return res.status(200).json(result);
    }

    if (req.method === "DELETE") {
      const { hard } = req.body;
      // deleteResponse 서비스 함수가 있다고 가정
      const result = await deleteFeedbackService(id as string, adminName, true);
      return res.status(200).json(result);
    }

    return res.status(405).json({ message: "허용되지 않은 메서드입니다." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}
