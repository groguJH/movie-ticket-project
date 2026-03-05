export interface TMDBMovieEntity {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  original_title: string;
  description: string;
}

export type TMDBMovieResponse = TMDBMovieEntity;

export interface MovieRequest extends TMDBMovieEntity {
  media_type: "movie";
}

export interface MovieResponse {
  results: MovieRequest[];
  page: number;
  total_pages: number;
  total_results: number;
}
