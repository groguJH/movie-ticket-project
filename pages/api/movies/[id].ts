import type { NextApiRequest, NextApiResponse } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_SECRET_KEY = process.env.API_SECRET_KEY;

/**
 *
 * @param req
 * @param res
 * @description
 * TMDB에서 영화 상세 정보를 가져옵니다.
 * 1. 영화 ID로 기본 영화 정보를 조회합니다.
 * 2. 쿼리 파라미터에 includeCredits=true가 있으면 출연진 정보도 함께 조회합니다.
 * 3. 출연진 정보는 필요시 credits 필드에 포함되어 반환됩니다.
 */
export default async function fetchMovieDetailHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      return res.status(400).json({ error: "허용되지 않은 메서드입니다." });
    }

    const { id, includeCredits } = req.query;
    if (!id) {
      return res.status(400).json({ error: "영화 ID가 필요합니다." });
    }

    // ✅ 1. TMDB API 호출 (DB 조회 제거!)
    const movieRes = await fetch(
      `${API_URL}movie/${encodeURIComponent(
        String(id)
      )}?api_key=${API_SECRET_KEY}&language=ko-KR`
    );

    if (!movieRes.ok) {
      return res.status(500).json({ error: "TMDB 영화 정보 요청 실패" });
    }

    const movieData = await movieRes.json();

    const movieWithTypeResults = {
      ...movieData,
      mediaType: "movie" as const,
    };

    // ✅ 2. 출연진 정보 필요하면 추가 요청
    if (includeCredits === "true") {
      const creditsRes = await fetch(
        `${API_URL}movie/${id}/credits?api_key=${API_SECRET_KEY}&language=ko-KR`
      );
      if (!creditsRes.ok) {
        return res
          .status(500)
          .json({ error: "출연진 정보를 가져오는데 실패했습니다." });
      }
      const creditsData = await creditsRes.json();
      return res
        .status(200)
        .json({ ...movieWithTypeResults, credits: creditsData });
    }

    res.status(200).json(movieWithTypeResults);
  } catch (error) {
    console.error("서버 에러:", error);
    res.status(500).json({ error: "서버 에러가 발생했습니다." });
  }
}
