import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { formatData } from "../../../lib/utils/formatData";
import MyPageBookingPresenter from "../../components/presenters/myPage/MyPageBookingPresenter";
import { Empty, message } from "antd";
import {
  EmptyMessage,
  FullPageSkeleton,
} from "../../components/utils/loadingUI";

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: "available" | "sold";
}
export interface Booking {
  _id: string; // 예매 번호
  showtimeId: string; // 영화 제목
  bookedAt: string; // 예매 날짜
  seats: Seat[];
  movieTitle: string; // 추가!
}
/**
 *  마이페이지 예매내역 컨테이너 컴포넌트
 * @description
 * 1. 예매내역은 사용자 인증 상태시 접근가능하며, 비로그인 시 메시지 표시
 * 2. 마이페이지용 예매 내역을 API로부터 조회
 * 3. 예매 내역이 있을 경우 MyPageBookingPresenter 컴포넌트에 데이터를 전달하여 UI 렌더링
 */

export default function BookingTicketContainer() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // 훅은 최상단에
  useEffect(() => {
    // 인증 완료된 경우에만 호출
    if (status !== "authenticated") return;

    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/booking/myPageList");
        if (!res.ok) throw new Error("예매내역 불러오기 실패");
        const data: Booking[] = await res.json();
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [status]);

  // 로딩, 인증 확인
  if (status === "loading") return <FullPageSkeleton />;
  if (!session) return <p>로그인이 필요합니다</p>;

  // 실제 렌더
  if (loading) {
    return <p>예매내역 로딩 중...</p>;
  }

  if (bookings.length === 0) {
    return (
      <EmptyMessage>
        <p style={{ marginBottom: "20px" }}>예매 내역이 없습니다.</p>

        <Empty />
      </EmptyMessage>
    );
  }

  return (
    <>
      {bookings.map((b) => {
        const bookingDate = formatData(b.bookedAt);
        return (
          <MyPageBookingPresenter
            key={b._id}
            userId={b._id}
            movieTitle={b.movieTitle}
            selectedDate={bookingDate}
            seats={b.seats}
            children={undefined}
          />
        );
      })}
    </>
  );
}
