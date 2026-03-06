export interface TvDetail {
  tv: TvDetail;
  id: number;
  name: string;
  overview: string;
  backdrop_path: string;
  episode_run_time: number[];
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  status: string;
  popularity: number;
  imageBaseUrl: string;
  number_of_seasons: number;
  number_of_episodes: number;
  media_type: string;
}

// TvBanner.tsx도 비슷하게 수정
export interface TvBannerProps {
  tv: TvDetail;
  imageBaseUrl: string;
}
