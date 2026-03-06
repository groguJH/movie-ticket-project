import clientPromise from "../../../lib/mongodb";
import { Movie } from "../../../types/movieBooking";

/**
 *
 * 모든 영화 정보를 조회하는 레포지토리 함수
 * @returns Movie[]
 *
 */
export async function findAllBookingMovies(): Promise<Movie[]> {
  const client = await clientPromise;
  return client
    .db("mymovieticket")
    .collection<Movie>("movie_movies")
    .find({})
    .toArray();
}
