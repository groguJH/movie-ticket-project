import { getServerSession } from "next-auth";
import clientPromise from "../../../lib/mongodb";
import { authOptions } from "../auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * 즐겨찾기 삭제 API 핸들러
 * @description
 * 1. HTTP DELETE 요청을 처리하여 사용자의 즐겨찾기 목록에서 특정 영화를 삭제
 * 2. 사용자 인증을 위해 NextAuth의 getServerSession을 사용
 * 3. MongoDB에서 해당 사용자의 즐겨찾기 항목을 찾아 삭제
 * 4. _id 가 아닌 movieId로 삭제 후 즐겨찾기 개수 반환
 */

export default async function removeFavoriteMovie(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
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
    const { movieId } = req.body;

    if (!userId || !movieId) {
      return res.status(400).json({ success: false, message: "필수 값 누락" });
    }

    await collection.deleteOne({ userId, movieId });

    const favoriteNumber = await collection.countDocuments({ movieId });

    res.status(200).json({
      success: true,
      message: "즐겨찾기 해제 성공",
      favoriteNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 에러 발생" });
  }
}
