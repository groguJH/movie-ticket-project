import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

/**
 * 나의 마이페이지 즐겨찾기 목록 조회 API 핸들러
 * @description
 * 1. 사용자 인증 상태를 확인하고, 비로그인 시 메시지 반환
 * 2. MongoDB에서 해당 사용자의 즐겨찾기 목록을 조회
 * 3. 각 영화 데이터에 TMDB 이미지의 전체 URL을 추가하여 반환
 * 4. 성공 시 즐겨찾기 목록을 JSON 형식으로 응답, 실패 시 에러 메시지 반환
 */

export default async function listFavoriteMovies(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET")
      return res.status(405).json({ message: "허용되지 않은 메서드입니다." });

    const session = await getServerSession(req, res, authOptions);
    if (!session)
      return res.status(401).json({ message: "로그인이 필요합니다." });

    const userId = session.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "유저 정보를 찾지못했습니다." });
    }

    const client = await clientPromise;
    const db = client.db("mymovieticket");
    const collection = db.collection("favoriteMovies");

    const favorites = await collection.find({ userId }).toArray();

    // TMDB 이미지 기본 URL
    const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

    // 각 영화 데이터에 fullImageUrl 추가, key 지정합니다.
    const modifiedFavorites = favorites.map((movie) => {
      return {
        key: movie.movieId,
        userId,
        ...movie,
        fullImageUrl: movie.moviePost
          ? `${IMAGE_BASE_URL}w500${movie.moviePost}`
          : null,
      };
    });

    return res.status(200).json(modifiedFavorites);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "서버 오류 발생" });
  }
}
