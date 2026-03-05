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
import { CarouselProps, MovieProps } from "../../../../types/MovieCarouselData";
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

  const groupedMovies: MovieProps[][] = [];
  for (let i = 0; i < movies.length; i += 4) {
    groupedMovies.push(movies.slice(i, i + 4));
  }

  const settings = {
    arrows: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current: number) => {
      hideClonedSlides();
    },
    beforeChange: () => {
      hideClonedSlides();
    },
  };

  const hideClonedSlides = () => {
    setTimeout(() => {
      const clonedSlides = document.querySelectorAll(
        ".movie-carousel .slick-cloned",
      );
      clonedSlides.forEach((slide) => {
        (slide as HTMLElement).style.display = "none !important";
      });
    }, 10);
  };

  useEffect(() => {
    hideClonedSlides();

    const interval = setInterval(() => {
      hideClonedSlides();
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [movies]);

  const handleMoreContents = () => {
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
          {groupedMovies.map((movieGroup: MovieProps[], groupIndex: number) => (
            <div key={`movie-group-${groupIndex}`}>
              <ContentDiv>
                {movieGroup.map((movie: MovieProps) => (
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
