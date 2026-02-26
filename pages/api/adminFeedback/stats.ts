import { NextApiRequest, NextApiResponse } from "next";
import { getFeedbackStatsService } from "../../../src/services/adminFeedback/FeedbackAdService";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);
  const AdminName = (session?.user?.name as string) ?? "admin-unknown";

  if (session?.user?.role !== "admin") {
    return res.status(403).json({ message: "접근 권한이 없습니다." });
  }
  if (req.method !== "GET")
    return res.status(405).json({ message: "허용되지 않은 메서드입니다." });

  const stats = await getFeedbackStatsService();
  return res.status(200).json(stats);
}
