import { useRouter } from "next/router";
import { Movie } from "../../../types/MovieCarouselData";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import {
  EmptyMovieList,
  FullPageSkeleton,
} from "../../components/utils/loadingUI";
import { fetchBookingMovies } from "../../../queries/movieQueries";

/**
 * 홈페이지 캐러셀 컨테이너 컴포넌트
 * @description
 * 1. React Query를 사용하여 캐러셀에 표시할 영화 데이터를 비동기 조회
 * 2. CSR 전용 CarouselPresenter 컴포넌트를 동적 임포트하여 클라이언트 사이드에서만 렌더링
 * 3. 캐러셀의 슬라이드 변경 및 버튼 클릭 이벤트 핸들러 구현
 */

interface CarouselContainerProps {
  initialData: Movie[];
}

export default function CarouselContainer({
  initialData,
}: CarouselContainerProps) {
  const router = useRouter();

  const CarouselPresenter = dynamic(
    () => import("../../components/presenters/HomeCarousel/CarouselPresenter"),
    { ssr: true },
  );

  const {
    data: movies,
    isLoading,
    isError,
  } = useQuery<Movie[]>({
    queryKey: ["CarouselMovieData"],
    queryFn: fetchBookingMovies,
    initialData: initialData,
    staleTime: 1000 * 60 * 2,
  });

  const handleClickReserve = (id: string) => {
    router.push(`/bookPage/${id}`);
  };

  const handleClickDetail = (tmdbId: number) => {
    router.push(`/moviePage/${tmdbId}`);
  };

  if (isError || !movies || movies.length === 0) {
    return <EmptyMovieList />;
  }
  if (isLoading) return <FullPageSkeleton />;

  return (
    <CarouselPresenter
      movies={movies}
      onClickReserve={handleClickReserve}
      onClickDetail={handleClickDetail}
    />
  );
}
