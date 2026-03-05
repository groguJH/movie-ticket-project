import { Button } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CastMember, MovieDetail } from "../../../types/fetchMovieBooking";
import FavoriteContainer from "../buttonFavorite/FavoriteContainer";
import {
  ButtonContainer,
  CardWrapper,
  LikeButtonWrapper,
  PageWrapper,
} from "../../components/utils/MovieDetailLists";
import MovieBanner from "../../components/presenters/movielist/MovieBanner";
import MovieInfoTb from "../../components/presenters/movielist/MovieInfoTb";
import MovieCastList from "../../components/presenters/movielist/MovieCastList";

export default function MovieListDetailContainer() {
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [casts, setCasts] = useState<CastMember[]>([]);
  const [showCasts, setShowCasts] = useState(false);
  const { data: session } = useSession();
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
  const includeCredits = true;

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!router.isReady || !router.query.id) return;

      try {
        const res = await fetch(`/api/movies/${router.query.id}`);
        if (!res.ok) {
          throw new Error(`API 요청 실패: ${res.status}`);
        }
        const data: MovieDetail = await res.json();
        setMovie(data);
      } catch (error) {
        console.error("영화정보 에러발생", error);
      }
    };

    fetchMovieData();
  }, [router.isReady, router.query.id]);

  const fetchCredits = async () => {
    if (!router.isReady || !router.query.id) return;

    try {
      const creditsRes = await fetch(
        `/api/movies/${router.query.id}?includeCredits=${includeCredits}`,
      );

      if (!creditsRes.ok) {
        throw new Error(`API 요청 실패: ${creditsRes.status}`);
      }
      const crewData: MovieDetail = await creditsRes.json();
      setCasts(crewData?.credits?.cast ?? []);
    } catch (error) {
      console.error("출연진데이터 에러발생", error);
    }
  };

  const handleToggleCasts = () => {
    if (!showCasts) {
      fetchCredits();
    }
    setShowCasts((prev) => !prev);
  };

  return (
    <PageWrapper>
      <CardWrapper>
        {/* 영화 데이터가 있을 때 MovieBanner 컴포넌트를 렌더링 */}
        {movie && IMAGE_BASE_URL && (
          <MovieBanner movie={movie} imageBaseUrl={IMAGE_BASE_URL} />
        )}
        <MovieInfoTb movie={movie} />

        <ButtonContainer>
          <Button onClick={handleToggleCasts}>
            {showCasts ? "출연자 숨기기" : "출연자 보기"}
          </Button>
        </ButtonContainer>

        <LikeButtonWrapper>
          {showCasts && movie && (
            <FavoriteContainer
              movieId={
                typeof router.query.id === "string" ? router.query.id : ""
              }
              userId={session?.user?.id || "guest"}
              movieTitle={movie.title}
              moviePost={movie.backdrop_path}
              movieRunTime={movie.runtime}
              mediaType={movie.mediaType ?? "movie"}
              bookingId={""}
            />
          )}
        </LikeButtonWrapper>
        {/* casts 상태에 크루 정보(예: casts.credits)가 있다면 이를 화면에 출력 */}
        {showCasts && (
          <MovieCastList casts={casts} imageBaseUrl={IMAGE_BASE_URL!} />
        )}
      </CardWrapper>
    </PageWrapper>
  );
}
