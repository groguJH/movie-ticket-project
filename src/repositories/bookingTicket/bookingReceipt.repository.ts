import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";
import { BookingReceiptProps } from "../../../types/movieBooking";

/**
 *
 * 사용자의 예매 내역 조회하는 레포지토리 함수
 * @param id
 * @returns {title:string, bookings: BookingReceiptProps[]}
 *
 */
export async function findBookingsByShowtime(id: string): Promise<any> {
  const client = await clientPromise;
  const db = client.db("mymovieticket");

  const isObjectId = id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id);

  const movieQuery: any = {
    $or: [{ tmdbId: id }, { tmdbId: Number(id) }],
  };

  const showtime = isObjectId
    ? await db.collection("movie_screenings").findOne({ _id: new ObjectId(id) })
    : null;

  const movieIdFromShowtime = showtime?.movieId;
  const tmdbIdFromShowtime = showtime?.tmdbId;

  const bookingQuery: any = {
    $or: [
      { showtimeId: id },
    ],
  };

  if (isObjectId) {
    bookingQuery.$or.push({ showtimeId: new ObjectId(id) });
  }

  const bookings = await db
    .collection<BookingReceiptProps>("movie_bookings")
    .find(bookingQuery)
    .toArray();

  let movie = null;

  if (movieIdFromShowtime) {
    try {
      movie = await db.collection("movie_movies").findOne({
        _id:
          typeof movieIdFromShowtime === "string"
            ? new ObjectId(movieIdFromShowtime)
            : movieIdFromShowtime,
      });
    } catch (e) {
    }
  }

  if (!movie && tmdbIdFromShowtime) {
    movie = await db.collection("movie_movies").findOne({
      $or: [
        { tmdbId: tmdbIdFromShowtime },
        { tmdbId: Number(tmdbIdFromShowtime) },
      ],
    });
  }

  return {
    title: movie?.title || "알 수 없는 영화",
    bookings,
  };
}
