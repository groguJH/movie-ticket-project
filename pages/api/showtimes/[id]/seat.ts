import type { NextApiRequest, NextApiResponse } from "next";
import { SeatService } from "../../../../src/services/bookingTicket/seatService";

export default async function seatBooking(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const seats = await SeatService(req.query.id as string);
    res.status(200).json(seats);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "좌석 조회에 실패했습니다", error: error.message });
  }
}
