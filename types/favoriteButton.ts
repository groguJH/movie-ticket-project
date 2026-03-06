export interface FavoriteProps {
  movieId: string;
  movieTitle: string;
  moviePost: string;
  movieRunTime: number;
  userId: string;
  mediaType: string;
  bookingId: string;
}

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
