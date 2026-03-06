import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { JSX, useState } from "react";
import { Movie } from "../../../types/fetchMovieBooking";
import FetchingMoviesPresenter from "../../components/presenters/booking/BookingFetchPresenter";
import LoginModalContainer from "../login/LoginModalContainer";
import { fetchBookingMovies } from "../../../queries/movieQueries";
import {
  EmptyMovieList,
  FullPageSkeleton,
} from "../../components/utils/loadingUI";
import { message } from "antd";

/**
 * 영화 목록 조회 컨테이너 컴포넌트
 * @returns {JSX.Element}
 * @description
 * 1. React Query를 사용하여 전체 영화 목록을 비동기 조회
 * 2. 사용자가 '예매하기' 버튼을 클릭하면 세션 상태를 확인
 * 3. 로그인된 사용자는 해당 영화의 예매 페이지로 이동
 * 4. 비로그인 사용자는 로그인 모달을 표시하고, 비회원 예매 절차를 진행
 */
export default function BookingFetchContainer(): JSX.Element {
  const router = useRouter();
  const { data: session } = useSession();
  const [isModalOpen, setModalOpen] = useState(false);
  const [pendingMovieId, setPendingMovieId] = useState<string | null>(null);

  const { bookingId } = router.query;

  // 전체영화에서 영화목록을 가져오는 쿼리
  const {
    data: movieServerData,
    isLoading,
    isError,
    error,
  } = useQuery<Movie[]>({
    queryKey: ["movieLists", "movie"],
    queryFn: fetchBookingMovies,
  });

  // 예매하기 버튼 클릭
  const handleBookClick = (movieId: string) => {
    if (session?.user) {
      router.push(`/bookPage/${movieId}`);
      return;
    }

    // ✅ 비회원 bookingId가 이미 있으면 로그인 모달 띄우지 않음
    if (bookingId) {
      router.push(`/bookPage/${movieId}?bookingId=${bookingId}`);
      return;
    }

    setPendingMovieId(movieId);
    setModalOpen(true);
  };

  const handleNonMemberBooking = async () => {
    try {
      if (!pendingMovieId) return;
      await axios.get("/non-member/check");

      router.push(`/bookPage/${pendingMovieId}`);
    } catch (err) {
      console.error("북페이지오류", err);
      alert("비회원 예매 중 오류가 발생했습니다.");
    } finally {
      setModalOpen(false);
      setPendingMovieId(null);
    }
  };

  if (isLoading) {
    return <FullPageSkeleton />;
  }

  if (isError) {
    message.error("데이터를 불러오는 중 오류가 발생했습니다.");
    return <EmptyMovieList />;
  }

  return (
    <>
      <FetchingMoviesPresenter
        onBookClick={handleBookClick}
        movies={movieServerData ?? []}
      />
      {isModalOpen && (
        <LoginModalContainer
          onClose={() => {
            setModalOpen(false);
            setPendingMovieId(null);
          }}
          onNonMemberBooking={handleNonMemberBooking}
        />
      )}
    </>
  );
}
