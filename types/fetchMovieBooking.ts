export interface MoviePresenterProps {
  movies: Movie[];
  onBookClick: (movieId: string, showtimeId: string, seats: string[]) => void;
}

export interface Movie {
  _id: string;
  title: string;
  backdropPath: string;
  releaseDate: string;
}

export interface MovieBannerProps {
  movie: {
    title: string;
    overview: string;
    backdrop_path: string;
  };
  imageBaseUrl: string;
}

export interface MovieDetail {
  mediaType: string;
  credits?: {
    cast: CastMember[];
  };
  title: string;
  id: number;
  overview: string;
  backdrop_path: string;
  original_title: string;
  revenue: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  release_date: string;
  status: string;
  popularity: number;
}

export interface MovieInfoTbProps {
  movie: MovieDetail | null;
}

export interface DataType {
  key: string;
  field: string;
  value: string | number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
}

export interface CastProps {
  casts: CastMember[];
  imageBaseUrl: string;
}
