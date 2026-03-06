import { NextApiRequest, NextApiResponse } from "next";
import { Movie } from "../../../types/movieBooking";
import { findBookingMoviesService } from "../../../src/services/bookingTicket/bookingfindMoviesService";

/**
 *모든 영화내용을 가져오는 api로 홈 캐러셀에서 사용합니다.
 * @param req
 * @param res
 * @description
 *  - Method: GET
 *  - Response: Movie[] 영화 목록
 * @throws 405 - 허용되지 않은 메서드
 * @throws 500 - 서버 오류
 */

export default async function bookingFetchMovies(
  req: NextApiRequest,
  res: NextApiResponse<Movie[] | { message: string }>
) {
  try {
    // 1) GET 요청이 아니면 405
    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    // 2) Service 호출
    const movies = await findBookingMoviesService();

    // 3) 결과 응답
    res.status(200).json(movies);
  } catch (err: any) {
    console.error("영화 목록 조회 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
}
