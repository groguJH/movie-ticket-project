import { ReactNode } from "react";

export interface MyPageContainerProps {
  name: string | null;
}
export interface FavoriteItem {
  movieId: string;
  movieTitle: string;
  fullImageUrl: string;
  movieRunTime: number;
}

export interface FavoriteListContainerProps {
  movieId?: string;
  movieTitle: string;
  moviePost: string;
  movieRunTime: string;
  userData: string;
  onClickFavorite: () => Promise<void>;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
}

export interface Booking {
  bookingId: string;
  title: string;
  date: string;
  seats: Seat[];
}

export interface MyPagePresenterProps {
  name: string | null;
  children: {
    favorites: ReactNode;
    bookings: ReactNode;
  };
  hideGreeting?: boolean; // 새로 추가
}

export interface Movie {
  _id: string;
  bookingId: string;
  userId: string;
  mediaType: string;
  key: string;
  movieId: string;
  movieTitle: string;
  moviePost: string;
  movieRunTime: string;
  fullImageUrl: string;
  userData?: string;
}
