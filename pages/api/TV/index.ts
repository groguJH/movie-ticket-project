import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // https://api.themoviedb.org/3/
const API_SECRET_KEY = process.env.API_SECRET_KEY; // TMDB key

export default async function TVListHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(400).json({ error: "허용되지 않은 메서드입니다." });
  }

  const { page = "1" } = req.query; // 기본값은 1페이지

  try {
    const response = await axios.get(`${API_URL}tv/on_the_air`, {
      params: {
        api_key: API_SECRET_KEY,
        language: "ko-KR",
        page,
      },
    });

    // 원본 응답 객체 복사
    const prevData = response.data;

    // results만 가공해서 덮어씌움
    const afterData = prevData.results.map((item: any) => ({
      ...item,
      mediaType: "on_air_show" as const,
    }));

    // 결과에 덮어씌우기
    const resultData = {
      ...prevData,
      results: afterData,
    };

    return res.status(200).json(resultData);
  } catch (error) {
    console.error("TV 시리즈 목록을 가져오는 데 실패했습니다:", error);
    return res.status(500).json({ error: "서버 에러가 발생했습니다." });
  }
}
