import { NextApiRequest, NextApiResponse } from "next";
import {
  CreateFeedbackService,
  getFeedbackService,
} from "../../../../src/services/feedback/FeedbackService";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

/**
 * 피드백 작성, 조회 API 핸들러
 * @param req
 * @param res
 */
export default async function writeHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  req.body ?? {};
  const session = await getServerSession(req, res, authOptions);
  try {
    if (req.method == "POST") {
      const userId = session?.user?.id as string;
      const userName = (session?.user?.name as string) || "익명";
      const { title, content, satisfaction } = req.body;

      if (!title || !content || !satisfaction) {
        return res.status(400).json({ error: "모든 필드를 입력해주세요." });
      }

      await CreateFeedbackService({
        title,
        content,
        userName,
        userId,
        satisfaction,
        status: "before reply",
      });
      return res.status(200).json({
        message: "피드백이 작성되었습니다.",
      });
    }

    if (req.method === "GET") {
      const { page, limit } = req.query;
      const pageNumber = parseInt(page as string) || 1;
      const limitNumber = parseInt(limit as string) || 10;
      const data = await getFeedbackService({
        page: pageNumber,
        limit: limitNumber,
      });
      return res.status(200).json(
        data ?? {
          page: pageNumber,
          limit: limitNumber,
          total: 0,
          feedback: [],
        },
      );
    }
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "서버 에러가 발생했습니다." });
  }
}
