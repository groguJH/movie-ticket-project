import clientPromise from "../../../lib/mongodb";
import { insertBooking } from "../../repositories/bookingTicket/booking.repository";

export async function bookService(
  userId: string | null,
  showtimeId: string,
  seats: { row: string; number: number }[],
  bookingId?: string,
) {
  const client = await clientPromise;
  const session = client.startSession();
  let bookingResult = null;

  try {
    await session.withTransaction(async () => {
      const result = await insertBooking(
        showtimeId,
        seats,
        userId,
        session,
        bookingId,
      );

      if (!result) {
        throw new Error("예매 처리 중 오류가 발생했습니다.");
      }

      bookingResult = {
        ...result, // ✅ 전체 BookingResult 객체 그대로 사용
        bookedAt: result.bookedAt.toISOString(), // 문자열 변환
        status: "confirmed" as const,
      };
    });

    if (!bookingResult) {
      throw new Error("예매 처리 중 오류가 발생했습니다.");
    }

    return bookingResult;
  } finally {
    session.endSession();
  }
}
