import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";
import { NonMemberSearchResponse } from "../../../../types/nonmember";

/**
 *
 * 비회원 정보로 사용자 조회하는 레포지토리 함수
 * 이름, 생년월일, 전화번호, 비밀번호로 일치하는 사용자 조회
 * @param data : name, birth, phone, password
 * @returns
 */

export async function findNonMemberByInfo(payload: {
  name: string;
  birth: string;
  phone: string;
  password: string;
}) {
  const client = await clientPromise;
  const db = client.db("mymovieticket");

  return db.collection("non-member-user").findOne({
    name: payload.name,
    birth: payload.birth,
    phone: payload.phone,
    password: payload.password,
  });
}

export async function createNonMember(payload: {
  name: string;
  birth: string;
  phone: string;
  password: string;
  movieId?: string;
}) {
  const client = await clientPromise;
  const db = client.db("mymovieticket");
  const result = await db
    .collection<NonMemberSearchResponse>("non-member-user")
    .insertOne({
      name: payload.name,
      birth: payload.birth,
      phone: payload.phone,
      password: payload.password,
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
          from: "movie_movies", // 🔥 영화 컬렉션
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
