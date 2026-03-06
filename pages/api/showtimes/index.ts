import { NextApiRequest, NextApiResponse } from "next";
import { getShowtimes } from "../../../src/services/bookingTicket/showtimeService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { movieId, date } = req.query;
  if (req.method !== "GET") return res.status(400).end();

  if (!movieId || !date) {
    return res.status(400).json({ message: "Missing movieId or date" });
  }
  try {
    const list = await getShowtimes(movieId as string, date as string);
    res.status(200).json(list);
  } catch (err: any) {
    // Service에서 던진 에러 메시지를 그대로 전달
    res
      .status(err.message.includes("필요합니다") ? 400 : 500)
      .json({ message: err.message });
  }
}
