//  영화데이터를 홈 캐러셀에 페칭하기 위한 타입 정의

export interface Movie {
  _id: string;
  tmdbId: number;
  title: string;
  overview: string;
  backdropPath: string;
  releaseDate: string;
}

export interface CarouselProps {
  movies: Movie[];
}

export interface MovieItemProps {
  movie: Movie;
  onClickReserve: (id: string) => void;
  onClickDetail: (id: string) => void;
}
