import axios from "axios";

/**
 * 캐러셀 전용 함수
 * @description
 * - 예약 가능한 영화 목록, 영화id 정보를 받아오기 위해
 * - 캐러셀 컨테이너에서 실시간으로 해당 함수의 결과를 관리합니다.
 */
export async function fetchBookingMovies() {
  const res = await axios.get("/api/bookingFetchMovies");
  return res.data;
}
