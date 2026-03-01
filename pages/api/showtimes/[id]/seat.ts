import type { NextApiRequest, NextApiResponse } from "next";
import { SeatService } from "../../../../src/services/bookingTicket/seatService";
import { ObjectId } from "mongodb";

export default async function seatBooking(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "허용되지 않은 메서드입니다." });
  }

  const { id } = req.query;

  if (typeof id !== "string" || !ObjectId.isValid(id)) {
    return res.status(400).json({ message: "유효하지 않은 요청 ID입니다." });
  }

  try {
    const seats = await SeatService(req.query.id as string);
    res.status(200).json(seats);
  } catch (error: any) {
    res.status(500).json({
      message: "좌석 조회에 실패했습니다. 잠시 후 다시 시도해주세요.",
    });
  }
}
