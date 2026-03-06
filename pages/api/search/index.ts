import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_SECRET_KEY = process.env.API_SECRET_KEY;
/**
 * 영화 및 TV 프로그램 통합 검색 API 핸들러
 * @param req
 * @param res
 * @description
 * - Method: GET
 * - Query Parameters:
 * - query: string - 검색어
 * - Response: { success: boolean, resultData: any[] } 검색 결과 데이터
 */

export default async function SearchHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query } = req.query;
  if (req.method !== "GET") {
    return res.status(400).json({ error: "허용되지 않은 메서드입니다." });
  }
  if (!query || typeof query != "string") {
    return res.status(400).json({ message: "검색어를 다시 입력해주세요" });
  }

  try {
    const response = await axios.get(`${API_URL}search/multi`, {
      params: {
        api_key: API_SECRET_KEY,
        query,
        page: 1,
        language: "ko-KR",
      },
    });

    const resultData = response.data.results.filter(
      (item: any) => item.media_type === "movie" || item.media_type === "tv",
    );

    return res.status(200).json({ success: true, resultData });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "TMDB 검색 중 오류가 발생했습니다." });
  }
}
