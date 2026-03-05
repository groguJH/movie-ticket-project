import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { Showtime } from "../../../types/movieBooking";

/**
 *
 * 특정 영화의 특정 날짜 범위 내 상영시간 조회하는 레포지토리 함수
 * @param movieId
 * @param dateStart
 * @param dateEnd
 * @returns Showtime[]
 * @description
 * movieId는 TMDB ID 또는 MongoDB ObjectId일 수 있으므로 둘 다 처리
 * 하루 범위(>=start, <end) 내의 showtime 리스트 조회
 */
export async function findShowtimesByDate(
  movieId: string,
  dateStart: Date,
  dateEnd: Date,
): Promise<Showtime[]> {
  const db = (await clientPromise).db("mymovieticket");

  const isObjectId = movieId.length === 24 && /^[0-9a-fA-F]{24}$/.test(movieId);

  const query: any = {
    $or: [{ tmdbId: movieId }, { tmdbId: Number(movieId) }],
    date: {
      $gte: dateStart,
      $lt: dateEnd,
    },
  };

  if (isObjectId) {
    query.$or.push({ movieId: new ObjectId(movieId) });
  }

  return db.collection<Showtime>("movie_screenings").find(query).toArray();
}
