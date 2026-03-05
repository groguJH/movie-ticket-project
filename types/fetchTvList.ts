export interface TvDetailEntity {
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
  number_of_seasons: number;
  number_of_episodes: number;
  mediaType: string;
}
export type TvDetailProps = TvDetailEntity;

export interface TvBannerProps {
  tv: TvDetailEntity;
  imageBaseUrl: string;
}

export interface TvInfoProps {
  tv: TvDetailEntity;
}
