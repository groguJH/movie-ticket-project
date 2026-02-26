import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";
import { UpdateFeedbackService } from "../../../../../src/services/feedback/FeedbackService";

/**
 * 피드백 수정 기능 API 핸들러
 * @param req
 * @param res
 * @description
 * 메소드, 세션, 입력 데이터 검증 후 피드백 수정 서비스를 호출합니다.
 * - Method: PATCH
 * - Request Body: { title: string, content: string, satisfaction: string }
 * - Response: { message: string, updated: any }
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "허용되지 않는 메서드입니다." });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: "로그인이 필요한 서비스입니다." });
  }

  const userId = session.user.id as string;

  const { id } = req.query;
  const { title, content, satisfaction } = req.body;

  if (
    !id ||
    typeof id !== "string" ||
    typeof title !== "string" ||
    typeof content !== "string" ||
    typeof satisfaction !== "string"
  ) {
    return res.status(400).json({ error: "잘못된 요청 데이터입니다." });
  }

  try {
    const updated = await UpdateFeedbackService(id, userId, satisfaction, {
      title,
      content,
    });
    return res
      .status(200)
      .json({ message: "피드백이 수정되었습니다.", updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "서버 에러가 발생했습니다." });
  }
}
