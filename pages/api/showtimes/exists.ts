import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

/**
 * 예매 가능 여부 확인 API
 * @description
 * 1. 쿼리 파라미터로 전달된 movieId를 검증
 * 2. MongoDB의 screenings 컬렉션에서 해당 movieId로 상영 정보가 존재하는지 확인
 * 3. 상영 정보가 존재하면 { canBook: true }, 없으면 { canBook: false } 반환
 * 4. 오류 발생 시에도 { canBook: false } 반환
 * 5. 만약 24자리라면 ObjectId 검색 조건도 추가 (캐러셀용)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") return res.status(405).end();

  const { movieId } = req.query;

  if (!movieId || typeof movieId !== "string") {
    return res.status(200).json({ canBook: false });
  }

  try {
    const client = await clientPromise;
    const db = client.db("mymovieticket");

    // 1. 24자리 유효한 ObjectId 형식인지 체크
    const isObjectId =
      movieId.length === 24 && /^[0-9a-fA-F]{24}$/.test(movieId);

    const query: any = {
      $or: [{ tmdbId: movieId }, { tmdbId: Number(movieId) }],
    };

    if (isObjectId) {
      query.$or.push({ movieId: new ObjectId(movieId) });
    }

    const exists = await db.collection("movie_screenings").findOne(query);

    return res.status(200).json({ canBook: !!exists });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(200).json({ canBook: false });
  }
}
