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
 * @throws 400 - 잘못된 요청
 * @throws 500 - 서버 오류
 */
export default async function booking(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // if (req.method !== "POST") return res.status(400).end();
  const session = await getServerSession(req, res, authOptions);
  const { movieId, showtimeId, seats, bookingId } = req.body;
  if (!session?.user?.id && !bookingId) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  if (!movieId || !showtimeId || !seats) {
    return res.status(400).json({ message: "필수 정보가 누락되었습니다." });
  }

  try {
    // 유저 예매(로그인)와 비회원 예매(bookingId)를 구분하여 서비스 호출
    let bookInfo;
    if (bookingId) {
      // 비회원 예매: bookingId 기반 처리 (서비스가 bookingId를 받도록 구현되어 있어야 함)
      bookInfo = await bookService(null, showtimeId, seats, bookingId);
    } else {
      // 로그인 사용자 예매
      const userId = session!.user!.id;
      bookInfo = await bookService(userId, showtimeId, seats);
    }

    return res.status(201).json({ success: true, bookInfo });
  } catch (err: any) {
    res
      .status(400)
      .json({ success: false, message: err.message ?? "예매 실패" });
  }
}
