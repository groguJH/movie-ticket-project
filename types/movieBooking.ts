import { ObjectId } from "mongodb";
import { Dayjs } from "dayjs";

export interface Movie {
  movieTitle?: string;
  _id: string;
  tmdbId: number;
  title: string;
  overview?: string;
  backdropPath?: string;
  releaseDate: Date;
}

export type MoviePayload = Movie;

export interface Showtime {
  _id: ObjectId | string;
  movieId: ObjectId | string;
  tmdbId: number | string;
  theater: string[];
  screen: string;
  startTime: Date;
  seats: Seat[];
}

export type SeatStatus = "available" | "sold";

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
}

export interface BookingRequest {
  showtimeId: string;
  seats: Seat[];
}

export interface BookingRecord {
  startTime: string | number | Date | Dayjs | null | undefined;
  _id: string;
  userId: string;
  showtimeId: string;
  seats: Seat[];
  bookingNumber: string;
  bookedAt: Date;
}

export interface BookingReceiptProps {
  _id: string | ObjectId;
  showtimeId: string | ObjectId;
  bookingNumber: string;
  seats: {
    status: SeatStatus;
    row: string;
    number: number;
  }[];
  bookedAt: Date;
  userId?: string | ObjectId | null;
  guestId?: string | ObjectId | null;
}

export type StepKey = "movie" | "date" | "seat" | "book" | "confirm";

export interface BookingPresenterProps {
  isCheckingCanBook: boolean;
  hasNoSchedule: boolean;
  availableTheaters: string[];
  filteredShowtimes: {
    _id: string;
    startTime: Date;
    screen: string;
  }[];
  userName: string | "예매자";
  userId: string;
  seats: Seat[];
  chosenSeats: Seat[];
  bookings: BookingRecord[];
  isShowtimeLoading: boolean;
  isBookingLoading: boolean;
  isSeatLoading: boolean;
  selectedDate: string;
  selectedTheater: string;
  selectedShowtime: string;
  onDateChange: (date: string) => void;
  onTheaterSelect: (theater: string) => void;
  onTimeSelect: (id: string) => void;
  onSeatToggle: (seat: Seat) => void;
  onBook: () => void;
  bookInfo: BookingRecord | null;
  activeTab: StepKey;
  onTabChange: (key: string) => void;
  movieTitle: string;
}
