import { useCallback, useEffect, useRef, useState } from "react";
import {} from "../../../pages/api/movies/fetchMovies";
import {
  CardImage,
  CardOverlay,
  HeaderBackground,
  HeaderWrapper,
  HeadParagraph,
  ListWrapper,
  MovieCard,
} from "../../components/utils/MovieListLayout";
import Link from "next/link";
import { MovieRequest, MovieResponse } from "../../../types/movieList";
import {
  FullPageSkeleton,
  InlineSmallSpinner,
} from "../../components/utils/loadingUI";
import Image from "next/image";

/**
 * 영화 목록 조회 컨테이너 컴포넌트
 * @description
 * 1. API를 통해 영화 데이터를 페이지네이션 방식으로 비동기 조회
 * 2. 무한 스크롤 기능 구현으로 사용자가 스크롤할 때마다 추가 영화 데이터 로드
 * 3. 중복된 영화 데이터 제거 로직 포함
 * 4. 메인 영화 이미지와 개요를 헤더에 표시
 * 5. 영화 목록을 카드 형식으로 렌더링하여 사용자에게 제공합니다.
 * 6. 로딩 및 에러 상태 처리하였습니다.
 */

export default function MovieListContainer() {
  const [movies, setMovies] = useState<MovieRequest[]>([]);
  const [MainMovieImage, setMainMovieImage] = useState<MovieRequest | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

  const fetchMovies = useCallback(
    async (pageNumber: number) => {
      if (loading) return;
      setLoading(true);

      try {
        const res = await fetch(`/api/movies/fetchMovies?page=${pageNumber}`);
        const data: MovieResponse = await res.json();

        setMovies((prevMovies) => {
          const existingIds = new Set(prevMovies.map((movie) => movie.id));
          const newMovies =
            data?.results?.filter((movie) => !existingIds.has(movie.id)) || [];
          return [...prevMovies, ...newMovies];
        });

        setMainMovieImage((prev) => prev || data?.results?.[0] || null);
        setPage(pageNumber);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    },
    [loading],
  );

  useEffect(() => {
    fetchMovies(1);
  }, [fetchMovies]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchMovies(page + 1);
        }
      },
      { threshold: 0.5 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [page, loading, fetchMovies]);

  if (loading && movies.length === 0) {
    return <FullPageSkeleton />;
  }

  return (
    <div>
      {MainMovieImage && (
        <HeaderWrapper>
          <Link
            key={MainMovieImage.id}
            href={`/moviePage/${MainMovieImage.id}`}
          >
            <HeaderBackground className="header-background">
              <Image
                src={`${IMAGE_BASE_URL}w1280${MainMovieImage.backdrop_path}`}
                alt={MainMovieImage.title}
                width={1280}
                height={720}
              />
            </HeaderBackground>
            <HeadParagraph className="header-paragraph">
              <h3>{MainMovieImage.title}</h3>
              <p>{MainMovieImage.overview}</p>
            </HeadParagraph>
          </Link>
        </HeaderWrapper>
      )}

      <ListWrapper>
        {movies
          ?.filter((movie) => movie.overview)
          .map((movie) => (
            <Link key={movie.id} href={`/moviePage/${movie.id}`}>
              <MovieCard>
                <CardImage
                  image={`${IMAGE_BASE_URL}w1280${movie.backdrop_path}`}
                >
                  <CardOverlay className="overlay">
                    <h3>{movie.title}</h3>
                    <p>{movie.overview}</p>
                  </CardOverlay>
                </CardImage>
              </MovieCard>
            </Link>
          ))}
      </ListWrapper>

      <div ref={observerRef}>{loading && <InlineSmallSpinner />}</div>
    </div>
  );
}
