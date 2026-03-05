import clientPromise from "../../../lib/mongodb";
import { MoviePayload } from "../../../types/movieBooking";

/**
 *
 * 모든 영화 정보를 조회하는 레포지토리 함수
 * @returns MoviePayload[]
 *
 */
export async function findAllBookingMovies(): Promise<MoviePayload[]> {
  const client = await clientPromise;
  return client
    .db("mymovieticket")
    .collection<MoviePayload>("movie_movies")
    .find({})
    .toArray();
}
