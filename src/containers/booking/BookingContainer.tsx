import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  BookingRecord,
  Seat,
  Showtime,
  StepKey,
} from "../../../types/movieBooking";

import { useSession } from "next-auth/react";
import BookingPresenter from "../../components/presenters/booking/BookingPresenter";
import { formatDate } from "../../components/presenters/booking/BookingFetchPresenter";
import {
  EmptyMovieList,
  ErrorToast,
  FullPageSkeleton,
} from "../../components/utils/loadingUI";
import { useRouter } from "next/router";

/**
 * 영화 티켓을 예매하는 상세페이지 컨테이너 컴포넌트
 * @props { movieId: string } movieId - 예매할 영화의 ID
 * @returns {JSX.Element} 예매 컨테이너 컴포넌트
 * @description
 * 1. 사용자 인증 상태를 확인하고, 비로그인 시 메시지 표시
 * 2. 영화 제목을 API로부터 조회
 * 3. 예매 과정의 상태(날짜, 영화관, 시간, 좌석 선택 등)를 관리
 * 4. React Query를 사용하여 showtimes, seats, bookings 데이터를 비동기 조회
 * 5. 사용자가 선택한 옵션에 따라 예매 요청을 API로 전송하고, 성공 시 좌석 및 예매 내역 갱신
 * 6. BookingPresenter 컴포넌트에 필요한 데이터와 핸들러를 전달하여 UI 렌더링
 */

interface BookingContainerProps {
  movieId: string;
  hasNoScheduleFromPage?: boolean; // ✅ 이름 변경
}

export default function BookingContainer({
  movieId,
  hasNoScheduleFromPage = false,
}: BookingContainerProps) {
  // 비회원예매를 위해 추가
  const router = useRouter(); // ✅ ADDED: bookingId 읽기 위해 추가
  const bookingId = router.query.bookingId as string | undefined; // ✅ ADDED
  const isGuest = !!bookingId; // ✅ ADDED: bookingId 있으면 비회원

  const { data: session, status } = useSession();
  const qc = useQueryClient();
  const userId = session?.user?.id;
  const userName = session?.user?.name;
  const [movieTitle, setMovieTitle] = useState("");

  useEffect(() => {
    axios
      .get(`/api/booking/${movieId}`)
      .then((r) => setMovieTitle(r.data.title));
  }, [movieId]);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTheater, setSelectedTheater] = useState<string>("");
  const [selectedShowtime, setSelectedShowtime] = useState<string>("");
  const [chosenSeats, setChosenSeats] = useState<Seat[]>([]);
  const [bookInfo, setBookInfo] = useState<BookingRecord | null>(null);
  const [activeTab, setActiveTab] = useState<StepKey>("date");

  const {
    data: canBookData,
    isLoading: isCheckingCanBook,
    isError: isCanBookError,
  } = useQuery<{
    canBook: boolean;
  }>({
    queryKey: ["canBook", movieId],
    queryFn: () =>
      axios
        .get("/api/showtimes/exists", { params: { movieId } })
        .then((r) => r.data),
  });

  const hasNoSchedule =
    hasNoScheduleFromPage ||
    (!isCheckingCanBook && canBookData?.canBook === false);

  const formattedDate = selectedDate ? formatDate(selectedDate) : "";
  const { data: showtimes = [], isFetching: isShowtimeLoading } = useQuery<
    Showtime[]
  >({
    queryKey: ["showtimes", movieId, formattedDate],
    queryFn: () =>
      axios
        .get("/api/showtimes", { params: { movieId, date: formattedDate } })
        .then((r) => r.data),
    enabled: !!selectedDate && !hasNoSchedule,
  });

  const availableTheaters = Array.from(
    new Set(
      showtimes.flatMap((s) =>
        Array.isArray(s.theater) ? s.theater : [s.theater],
      ),
    ),
  );

  const filteredShowtimes = selectedTheater
    ? showtimes
        .filter((s) =>
          Array.isArray(s.theater)
            ? s.theater.includes(selectedTheater)
            : s.theater === selectedTheater,
        )
        .map((s) => ({
          ...s,
          _id: s._id.toString(),
        }))
    : [];

  const { data: seats = [], isFetching: isSeatLoading } = useQuery<Seat[]>({
    queryKey: ["seats", selectedShowtime],
    queryFn: () =>
      axios.get(`/api/showtimes/${selectedShowtime}/seat`).then((r) => r.data),
    enabled: !!selectedShowtime,
  });

  const { data: bookings = [], isFetching: isBookingLoading } = useQuery<
    BookingRecord[]
  >({
    queryKey: ["bookings", selectedShowtime],
    queryFn: () =>
      axios
        .get(`/api/booking/${selectedShowtime}`)
        .then((r) => r.data.bookings),
    enabled: !!selectedShowtime,
  });

  const bookingMutation = useMutation({
    mutationFn: () => {
      const payload = {
        userId: session?.user?.id,
        movieId,
        showtimeId: selectedShowtime,
        seats: chosenSeats,
      };

      if (isGuest) {
        (payload as any).bookingId = bookingId;
      }

      if (status === "authenticated" && userId) {
        return axios.post("/api/booking", payload);
      } else {
        return axios.post("/api/booking", payload);
      }
    },
    onSuccess: (res) => {
      const { bookInfo } = res.data;
      setBookInfo(bookInfo);
      qc.invalidateQueries({ queryKey: ["seats", selectedShowtime] });
      qc.invalidateQueries({ queryKey: ["bookings", selectedShowtime] });
      setActiveTab("confirm");
    },
  });

  const handleDateChange = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedTheater("");
    setSelectedShowtime("");
    setChosenSeats([]);
  };

  const handleTheaterSelect = (theater: string) => {
    setSelectedTheater(theater);
    setSelectedShowtime("");
    setChosenSeats([]);
  };
  const handleTimeSelect = (id: string) => {
    setSelectedShowtime(id);
    setChosenSeats([]);
  };
  const handleBook = () => bookingMutation.mutate();

  let activeKey: "movie" | "date" | "seat" | "book" | "confirm" = "date";

  if (!selectedDate) {
    activeKey = "date";
  } else if (!selectedTheater) {
    activeKey = "date";
  } else if (!selectedShowtime) {
    activeKey = "date";
  } else if (chosenSeats.length === 0) {
    activeKey = "seat";
  } else if (!bookInfo) {
    activeKey = "book";
  } else {
    activeKey = "confirm";
  }

  // 작성중
  if (status !== "authenticated") {
    router.push("/non-member");
  }
  if (status === "loading") return <FullPageSkeleton />;

  if (isCheckingCanBook) {
    return <FullPageSkeleton />;
  }

  if (isCanBookError) {
    ErrorToast("데이터를 불러오는 중 오류가 발생했습니다.");
    return <EmptyMovieList />;
  }

  return (
    <>
      <BookingPresenter
        isCheckingCanBook={isCheckingCanBook}
        hasNoSchedule={hasNoSchedule}
        userName={
          status === "authenticated" ? (userName ?? "예매자") : "비회원"
        }
        userId={status === "authenticated" ? (userId ?? "") : (bookingId ?? "")}
        availableTheaters={availableTheaters}
        filteredShowtimes={filteredShowtimes}
        seats={seats}
        chosenSeats={chosenSeats}
        bookings={bookings}
        selectedDate={selectedDate}
        selectedTheater={selectedTheater}
        selectedShowtime={selectedShowtime}
        isShowtimeLoading={isShowtimeLoading}
        isBookingLoading={isBookingLoading}
        isSeatLoading={isSeatLoading}
        bookInfo={bookInfo}
        onDateChange={handleDateChange}
        onTheaterSelect={handleTheaterSelect}
        onTimeSelect={handleTimeSelect}
        onSeatToggle={(seat: Seat) =>
          setChosenSeats((prev) =>
            prev.some((s) => s.row === seat.row && s.number === seat.number)
              ? prev.filter(
                  (s) => !(s.row === seat.row && s.number === seat.number),
                )
              : [...prev, seat],
          )
        }
        onBook={handleBook}
        activeTab={activeKey}
        onTabChange={(key: string) => setActiveTab(key as StepKey)}
        movieTitle={movieTitle}
      />
    </>
  );
}
