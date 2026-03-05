import { MoviePayload } from "../../../types/movieBooking";
import { findAllBookingMovies } from "../../repositories/bookingTicket/bookingFetchMovies.repository";

export async function findBookingMoviesService(): Promise<MoviePayload[]> {
  const movies = await findAllBookingMovies();
  return movies;
}
