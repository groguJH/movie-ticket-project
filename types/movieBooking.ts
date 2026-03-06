import { ObjectId } from "mongodb";
import { Dayjs } from "dayjs";

export interface Movie {
  movieTitle: any;
  _id: string;
  tmdbId: number;
  title: string;
  overview?: string;
  backdropPath?: string;
  releaseDate: Date;
}

export interface Showtime {
  _id: ObjectId; // string에서 ObjectId로 변경
  movieId: ObjectId | string; // ObjectId 또는 string 허용
  tmdbId: ObjectId | string;
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
  startTime(startTime: any): unknown;
  _id: string;
  showtimeId: string | ObjectId;
  seats: {
    status: string;
    row: string;
    number: number;
  }[];
  bookedAt: Date;
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
