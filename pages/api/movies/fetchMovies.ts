import type { NextApiRequest, NextApiResponse } from "next";
import {
  MovieRequest,
  MovieResponse,
  TMDBMovieResponse,
} from "../../../types/movieList";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_SECRET_KEY = process.env.API_SECRET_KEY;

export default async function fetchHandler(
  req: NextApiRequest,
  res: NextApiResponse<MovieResponse | { error: string }>
) {
  try {
    if (req.method !== "GET") {
      return res.status(400).json({ error: "허용되지 않은 메서드입니다." });
    }

    const pageNumber = req.query.page ? Number(req.query.page) : 1;

    if (pageNumber < 1)
      return res.status(400).json({ error: "잘못된 페이지 번호입니다." });

    const response = await fetch(
      `${API_URL}movie/popular?api_key=${API_SECRET_KEY}&language=ko-KR&page=${pageNumber}`
    );

    // 원본 TMDB API 응답 타입
    const data: {
      results: TMDBMovieResponse[];
      page: number;
      total_pages: number;
      total_results: number;
    } = await response.json();

    // media_type 추가
    const moviesWithType: MovieRequest[] = data.results.map((movie) => ({
      ...movie,
      media_type: "movie" as const,
    }));

    const responseWithType: MovieResponse = {
      results: moviesWithType,
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results,
    };

    res.status(200).json(responseWithType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "서버 에러가 발생하였습니다." });
  }
}
