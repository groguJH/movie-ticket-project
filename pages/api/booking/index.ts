import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { bookService } from "../../../src/services/bookingTicket/bookingService";
import { authOptions } from "../auth/[...nextauth]";

/**
 * 예매를 처리하는 API 핸들러
 * @param req
 * @param res
 * @description
 * - Method: POST
 * - Request Body: { movieId: string; showtimeId: string; seats: string[] }
 * - Response: { success: boolean; bookInfo?: any; message?: string }
 * - 좌석은 오직 한좌석만 예약 가능합니다.
 * @throws 400 - 잘못된 요청
 * @throws 500 - 서버 오류
 */
export default async function booking(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(400).end();

  const session = await getServerSession(req, res, authOptions);
  const { movieId, showtimeId, seats, bookingId } = req.body;

  if (!session?.user?.id && !bookingId) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  if (!movieId || !showtimeId || !seats) {
    return res.status(400).json({ message: "필수 정보가 누락되었습니다." });
  }

  if (!Array.isArray(seats) || seats.length !== 1) {
    return res.status(400).json({
      message: "현재는 한 번에 한 좌석만 예매할 수 있습니다.",
    });
  }

  const [seat] = seats;
  if (
    !seat ||
    typeof seat.row !== "string" ||
    typeof seat.number !== "number"
  ) {
    return res
      .status(400)
      .json({ message: "좌석 정보 형식이 올바르지 않습니다." });
  }

  try {
    let bookInfo;
    if (bookingId) {
      bookInfo = await bookService(null, showtimeId, seats, bookingId);
    } else {
      const userId = session!.user!.id;
      bookInfo = await bookService(userId, showtimeId, seats);
    }

    return res.status(201).json({ success: true, bookInfo });
  } catch (err: any) {
    const message = err?.message ?? "예매 실패";

    if (err?.name === "BSONError") {
      return res.status(400).json({
        success: false,
        message: "유효하지 않은 상영 정보입니다.",
      });
    }

    if (message.includes("한 번에 한 좌석만")) {
      return res.status(400).json({ success: false, message });
    }

    if (message.includes("이미 예약") || message.includes("찾을 수 없습니다")) {
      return res.status(409).json({ success: false, message });
    }

    return res.status(500).json({ success: false, message: "예매 실패" });
  }
}
