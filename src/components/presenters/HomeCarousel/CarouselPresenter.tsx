"use client";

import { Carousel } from "antd";
import { useEffect, useRef } from "react";
import {
  CarouselWrapper,
  ContentDiv,
  ContentStyle,
  ContentTitle,
  MoreContentsLink,
} from "../../utils/HomeCarouselLayout";
import MovieItemPresenter from "./MovieItemPresenter";
import { CarouselProps, Movie } from "../../../../types/MovieCarouselData";
import { useRouter } from "next/router";

export default function CarouselPresenter({
  movies,
  onClickReserve,
  onClickDetail,
}: CarouselProps & {
  onClickReserve: (id: string) => void;
  onClickDetail: (tmdbId: number) => void;
}) {
  const carouselRef = useRef<any>(null);
  const router = useRouter();

  // 영화 데이터를 4개씩 그룹으로 나누기
  const groupedMovies: Movie[][] = [];
  for (let i = 0; i < movies.length; i += 4) {
    groupedMovies.push(movies.slice(i, i + 4));
  }

  const settings = {
    arrows: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 600,
    slidesToShow: 1, // 한 번에 하나의 슬라이드(그룹)만 표시
    slidesToScroll: 1, // 한 번에 하나씩 이동
    afterChange: (current: number) => {
      // slick-cloned 엘리먼트 숨기기
      hideClonedSlides();
    },
    beforeChange: () => {
      // 슬라이드 변경 전에도 클론 숨기기
      hideClonedSlides();
    },
  };

  // slick-cloned 슬라이드들을 숨기는 함수
  const hideClonedSlides = () => {
    setTimeout(() => {
      const clonedSlides = document.querySelectorAll(
        ".movie-carousel .slick-cloned"
      );
      clonedSlides.forEach((slide) => {
        (slide as HTMLElement).style.display = "none !important";
      });
    }, 10);
  };

  // 컴포넌트 마운트 후 클론 슬라이드 숨기기
  useEffect(() => {
    hideClonedSlides();

    // 추가적인 정리 작업
    const interval = setInterval(() => {
      hideClonedSlides();
    }, 100);

    // 5초 후 interval 정리
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [movies]);

  const handleMoreContents = () => {
    // 더 많은 영화 보기 클릭 시 동작
    router.push("/bookPage");
  };

  return (
    <CarouselWrapper>
      <ContentStyle>
        <ContentTitle>
          <span>박스오피스</span>
          <MoreContentsLink onClick={handleMoreContents}>
            더 많은 영화보기
          </MoreContentsLink>
        </ContentTitle>

        <Carousel ref={carouselRef} className="movie-carousel" {...settings}>
          {groupedMovies.map((movieGroup: Movie[], groupIndex: number) => (
            <div key={`movie-group-${groupIndex}`}>
              <ContentDiv>
                {movieGroup.map((movie: Movie) => (
                  <MovieItemPresenter
                    key={movie._id}
                    movie={movie}
                    onClickReserve={onClickReserve}
                    onClickDetail={() => onClickDetail(movie.tmdbId)}
                  />
                ))}
              </ContentDiv>
            </div>
          ))}
        </Carousel>
      </ContentStyle>
    </CarouselWrapper>
  );
}
