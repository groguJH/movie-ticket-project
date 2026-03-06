import dayjs from "dayjs";
import { Showtime } from "../../../types/movieBooking";
import { findShowtimesByDate } from "../../repositories/bookingTicket/showtime.repository";

/**
 * 특정 영화의 특정 날짜의 상영시간 조회 서비스 함수
 * @param movieId
 * @param dateStr "YYYY-MM-DD" 형식의 날짜 문자열
 * @returns Showtime[]
 * @description
 * - movieId는 TMDB ID 또는 MongoDB ObjectId일 수 있으므로 둘 다 처리
 * - 해당 일의 00:00:00 ~ 다음 날 00:00:00 범위 내의 showtime 리스트 조회합니다.
 */

export async function getShowtimes(
  movieId: string,
  dateStr: string,
): Promise<Showtime[]> {
  if (!movieId || !dateStr) {
    throw new Error("영화아이디와 날짜는 필수입니다.");
  }

  const dayStart = dayjs(dateStr).startOf("day").toDate();
  const dayEnd = dayjs(dateStr).add(1, "day").startOf("day").toDate();

  const list = await findShowtimesByDate(movieId, dayStart, dayEnd);
  ({ movieId, dateStr, count: list.length });
  return list;
}
