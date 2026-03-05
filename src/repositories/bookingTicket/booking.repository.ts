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
  if (!Array.isArray(seats) || seats.length !== 1) {
    throw new Error("현재는 한 번에 한 좌석만 예매할 수 있습니다.");
  }

  const client = await clientPromise;
  let bookingNumber = "";
  let insertedBookingId = "";

  const result = await client
    .db("mymovieticket")
    .collection("movie_screenings")
    .updateOne(
      {
        _id: new ObjectId(showtimeId),
        seats: {
          $all: seats.map((s) => ({
            $elemMatch: { row: s.row, number: s.number, status: "available" },
          })),
        },
      },
      { $set: { "seats.$[s].status": "sold" } },
      {
        arrayFilters: [
          {
            $or: seats.map((s) => ({ "s.row": s.row, "s.number": s.number })),
          },
        ],
        session,
      },
    );

  if (result.modifiedCount !== 1) {
    throw new Error(
      "일부 좌석이 이미 예약되었거나 선택한 좌석을 찾을 수 없습니다.",
    );
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
