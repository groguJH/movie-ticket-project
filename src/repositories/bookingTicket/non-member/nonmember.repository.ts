import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";
import {
  NonMemberBookingFormValues,
  NonMemberSearchResponse,
} from "../../../../types/nonmember";
import bcrypt from "bcryptjs";

/**
 *
 * 비회원 정보로 사용자 조회하는 레포지토리 함수
 * 이름, 생년월일, 전화번호, 비밀번호로 일치하는 사용자 조회
 * @param data : name, birth, phone, password
 * @returns
 */

export async function findNonMemberByInfo(payload: NonMemberBookingFormValues) {
  const client = await clientPromise;
  const db = client.db("mymovieticket");

  const user = await db.collection("non-member-user").findOne({
    name: payload.name,
    birth: payload.birth,
    phone: payload.phone,
  });

  if (!user) return null;
  const isMatchPassword = await bcrypt.compare(payload.password, user.password);
  if (!isMatchPassword) return null;
  return user;
}

export async function createNonMember(payload: NonMemberSearchResponse) {
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const client = await clientPromise;
  const db = client.db("mymovieticket");
  const result = await db
    .collection<NonMemberSearchResponse>("non-member-user")
    .insertOne({
      name: payload.name,
      birth: payload.birth,
      phone: payload.phone,
      password: hashedPassword,
      movieId: payload.movieId ? payload.movieId : null,
      createdAt: new Date(),
    });
  return result.insertedId;
}

export async function findUpcomingByGuestId(guestId: string) {
  const client = await clientPromise;
  const db = client.db("mymovieticket");
  const bookings = await db
    .collection("movie_bookings")
    .aggregate([
      {
        $match: {
          guestId: new ObjectId(guestId),
        },
      },
      {
        $lookup: {
          from: "movie_screenings",
          localField: "showtimeId",
          foreignField: "_id",
          as: "showtime",
        },
      },
      {
        $unwind: {
          path: "$showtime",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "movie_movies",
          localField: "showtime.movieId",
          foreignField: "_id",
          as: "movie",
        },
      },
      {
        $unwind: "$movie",
      },
      {
        $sort: {
          "showtime.startTime": 1,
        },
      },
    ])
    .toArray();
  return bookings;
}
