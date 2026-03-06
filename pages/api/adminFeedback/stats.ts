import { NextApiRequest, NextApiResponse } from "next";
import { getFeedbackStatsService } from "../../../src/services/adminFeedback/FeedbackAdService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const stats = await getFeedbackStatsService();
    return res.status(200).json(stats);
  }
}
