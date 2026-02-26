import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import clientPromise from "../../../lib/mongodb";
import { authOptions } from "../auth/[...nextauth]";
import { ObjectId } from "mongodb";

/**
 * 회원 전용 예매내역을 조회하는 API 핸들러
 * @param req
 * @param res
 * @description
 * - Method: GET
 * - Response: 예매내역 배열
 * @throws 401 - 로그인이 필요합니다.
 * @throws 405 - 허용되지 않은 메서드
 * @throws 500 - 서버 오류
 */
export default async function myPageListHandler(
  req: NextApiRequest,
  res: NextApiResponse<any[] | { message: string }>,
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "허용되지 않은 메서드입니다." });

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
  const userId = session.user.id;
  const client = await clientPromise;
  const db = client.db("mymovieticket");
  try {
    const bookings = await db
      .collection("movie_bookings")
      .aggregate([
        {
          $match: { userId: new ObjectId(userId) },
        },
        {
          $lookup: {
            from: "movie_screenings",
            localField: "showtimeId",
            foreignField: "_id",
            as: "showtime",
          },
        },
        { $unwind: "$showtime" },
        {
          $lookup: {
            from: "movie_movies",
            localField: "showtime.movieId",
            foreignField: "_id",
            as: "movie",
          },
        },
        { $unwind: "$movie" },
        {
          $project: {
            _id: 1,
            showtimeId: 1,
            bookedAt: 1,
            seats: 1,
            movieTitle: "$movie.title",
          },
        },
      ])
      .toArray();

    res.status(200).json(bookings);
  } catch (error) {
    console.error("예매내역 조회 실패:", error);
    res.status(500).json({ message: "예매내역을 불러오지 못했습니다." });
  }
}
