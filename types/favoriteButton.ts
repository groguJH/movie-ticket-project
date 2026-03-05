export interface FavoriteEntity {
  movieId: string;
  movieTitle: string;
  moviePost: string;
  movieRunTime: number;
  mediaType: string;
  userId: string;
  bookingId: string;
}

export type FavoriteContainerProps = FavoriteEntity;

export interface ButtonProps {
  isFavorited: boolean;
  onClick: () => void;
}

export interface FavListItemPresenterProps {
  bookingId: string;
  movieId: string;
  movieTitle: string;
  moviePost: string;
  movieRunTime: string;
  mediaType: string;
  onClickFavorite: () => void;
  onClickDelete: () => void;
  isLoading?: boolean;
}
