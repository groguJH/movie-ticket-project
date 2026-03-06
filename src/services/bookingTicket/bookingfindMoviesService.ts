import { Movie } from "../../../types/movieBooking";
import { findAllBookingMovies } from "../../repositories/bookingTicket/bookingFetchMovies.repository";

export async function findBookingMoviesService(): Promise<Movie[]> {
  // 나중에 최신순정렬, 카테고리 필터 넣고싶을때 여기서
  const movies = await findAllBookingMovies();
  return movies;
}
