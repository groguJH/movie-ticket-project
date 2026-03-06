import { NextApiRequest, NextApiResponse } from "next";
import addResponse from "../../../../../src/services/adminFeedback/FeedbackAdService";
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

  if (req.method !== "POST") {
    return res.status(405).end({ message: "허용되지 않은 메서드입니다." });
  } else {
    const session = await getServerSession(req, res, authOptions);
    const adminName = session?.user?.name as string;
    const addResponseData = await addResponse(id as string, text, adminName);
    return res.status(200).json(addResponseData);
  }
}
