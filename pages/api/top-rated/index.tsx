import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_SECRET_KEY = process.env.API_SECRET_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "허용하지 않는 메소드입니다." });
  }

  try {
    // 3단계: 더 많은 영화 데이터 가져오기 (20개 정도)
    const response = await axios(
      `${API_URL}movie/top_rated?api_key=${API_SECRET_KEY}&language=ko-KR&page=1`
    );
    const movieList = response.data.results; // 일단 전체 가져오기

    // 4단계: 각 영화의 트레일러 정보 확인
    const moviePromises = movieList.map(async (movie: any) => {
      try {
        const videoData = await axios(
          `${API_URL}movie/${movie.id}/videos?api_key=${API_SECRET_KEY}&language=ko-KR`
        );

        const trailer = videoData.data.results.find(
          (v: any) =>
            v.type === "Trailer" &&
            v.site === "YouTube" &&
            v.key &&
            v.key.trim() !== "" &&
            v.official === true
        );

        if (trailer) {
          return {
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            popularity: movie.popularity,
            key: trailer.key,
          };
        }
        return null;
      } catch (error) {
        return null; // 개별 영화 에러 처리
      }
    });

    const results = await Promise.all(moviePromises);

    // 5단계: 조건을 만족하는 영화들만 필터링 후 5개 선택
    const validVideos = results.filter((video) => video !== null).slice(0, 5); // 여기서 5개로 제한

    res.status(200).json(validVideos);
  } catch (error) {
    console.error("TOP-RATED API 에러:", error);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
}
