export interface TMDBMovieEntity {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  original_title: string;
  description: string;
  // media_type 없음 (원본 API 응답)
}

export type TMDBMovieResponse = TMDBMovieEntity;

export interface MovieRequest extends TMDBMovieEntity {
  media_type: "movie"; // 우리가 추가하는 필드
}

export interface MovieResponse {
  results: MovieRequest[];
  page: number;
  total_pages: number;
  total_results: number;
}
