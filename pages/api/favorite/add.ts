import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "../../../lib/mongodb";

/**
 * 즐겨찾기 영화 추가 API 핸들러
 * @body { movieId: string, movieTitle: string, moviePost: string, movieRunTime: number, mediaType: 'movie' | 'tv' }
 * @returns { success: boolean, message: string, favoriteNumber?: number }
 * @description
 * 1. 사용자의 세션을 확인하여 로그인 상태인지 검증
 * 2. 요청 바디에서 영화 정보를 추출
 * 3. MongoDB의 favoriteMovies 컬렉션에 즐겨찾기 영화 정보를 저장
 * 4. 추가된 즐겨찾기 영화의 총 개수를 반환
 */

export default async function addFavoriteMovie(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "허용되지 않은 메서드입니다." });
  }

  try {
    const client = await clientPromise;
    const db = client.db("mymovieticket");
    const collection = db.collection("favoriteMovies");

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const userId = session.user?.id;
    const { movieId, movieTitle, moviePost, movieRunTime, mediaType } =
      req.body;

    if (!userId || !movieId) {
      return res.status(400).json({ success: false, message: "필수 값 누락" });
    }

    await collection.insertOne({
      userId,
      movieId,
      movieTitle,
      moviePost,
      movieRunTime,
      mediaType,
    });

    const favoriteNumber = await collection.countDocuments({ movieId });

    return res.status(201).json({
      success: true,
      message: `${mediaType === "movie" ? "영화" : "TV"} 즐겨찾기 추가`,
      favoriteNumber,
    });
  } catch (error) {
    res.status(500).json({ error: "서버 에러가 발생하였습니다." });
  }
}
