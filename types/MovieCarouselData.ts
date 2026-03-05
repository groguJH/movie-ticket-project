
export interface Movie {
  _id: string;
  tmdbId: number;
  title: string;
  overview: string;
  backdropPath: string;
  releaseDate: string;
}

export type MovieProps = Movie;

export interface CarouselProps {
  movies: Movie[];
}

export interface MovieItemProps {
  movie: Movie;
  onClickReserve: (id: string) => void;
  onClickDetail: (id: string) => void;
}
