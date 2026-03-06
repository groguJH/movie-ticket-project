import { ClientSession, ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";
import { DigitRandom12Number } from "../../components/utils/format/bookingRandom";

export async function insertBooking(
  showtimeId: string,
  seats: { row: string; number: number }[],
  userId: string | null,
  session: ClientSession,
  bookingId?: string,
) {
  const client = await clientPromise;
  let bookingNumber = "";
  let insertedBookingId = "";

  const result = await client
    .db("mymovieticket")
    .collection("movie_screenings")
    .updateOne(
      { _id: new ObjectId(showtimeId), "seats.status": "available" },
      { $set: { "seats.$[s].status": "sold" } },
      {
        arrayFilters: [
          {
            "s.row": { $in: seats.map((s) => s.row) },
            "s.number": { $in: seats.map((s) => s.number) },
          },
        ],
        session,
      },
    );

  if (result.modifiedCount !== seats.length) {
    throw new Error("일부 좌석이 이미 예약되었거나 변경 실패");
  }

  const bookedAt = new Date();

  while (!bookingNumber) {
    const tempBookingNumber = DigitRandom12Number();

    const existingBooking = await client
      .db("mymovieticket")
      .collection("movie_bookings")
      .findOne({ bookingNumber: tempBookingNumber });

    if (!existingBooking) {
      bookingNumber = tempBookingNumber;

      const insertResult = await client
        .db("mymovieticket")
        .collection("movie_bookings")
        .insertOne(
          {
            showtimeId: new ObjectId(showtimeId),
            seats,
            bookedAt,
            userId: userId ? new ObjectId(userId) : null,
            guestId: bookingId ? new ObjectId(bookingId) : null,
            bookingNumber,
          },
          { session },
        );

      insertedBookingId = insertResult.insertedId.toString();
    }
  }

  return {
    bookingNumber,
    bookingId: insertedBookingId,
    userId,
    showtimeId,
    seats,
    bookedAt,
  };
}
