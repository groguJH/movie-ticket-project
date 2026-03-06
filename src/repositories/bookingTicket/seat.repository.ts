import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

/**
 *
 * 영화 상영관의 좌석 정보 조회하는 레포지토리 함수
 * @param showtimeId
 * @returns
 */
export async function findSeatsShowTimes(showtimeId: string) {
  const client = await clientPromise;
  const show = await client
    .db("mymovieticket")
    .collection("movie_screenings")
    .findOne({ _id: new ObjectId(showtimeId as string) });
  return show?.seats || [];
}
