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

  // ✅ MODIFIED: showtime 먼저 찾기 (movie_screenings)
  const showtime = isObjectId
    ? await db.collection("movie_screenings").findOne({ _id: new ObjectId(id) })
    : null;

  // showtime에서 movieId 또는 tmdbId 추출
  const movieIdFromShowtime = showtime?.movieId;
  const tmdbIdFromShowtime = showtime?.tmdbId;

  // ✅ MODIFIED: showtimeId 타입이 string/ObjectId 둘 다 있을 수 있으므로 둘 다 조회
  const bookingQuery: any = {
    $or: [
      { showtimeId: id }, // string으로 저장된 경우
    ],
  };

  if (isObjectId) {
    bookingQuery.$or.push({ showtimeId: new ObjectId(id) }); // ObjectId로 저장된 경우
  }

  const bookings = await db
    .collection<BookingReceiptProps>("movie_bookings")
    .find(bookingQuery)
    .toArray();

  // ✅ MODIFIED: movie 찾는 기준은 showtime에서 얻은 movieId/tmdbId로 찾는다
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
      // movieIdFromShowtime가 ObjectId 변환 불가한 값이면 무시
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
