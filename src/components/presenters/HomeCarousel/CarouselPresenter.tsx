import { Carousel } from "antd";
import { useEffect, useState } from "react";
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
  const router = useRouter();
  const getItemsPerSlide = () => {
    if (typeof window === "undefined") {
      return 4;
    }

    return window.innerWidth <= 768 ? 2 : 4;
  };
  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide);

  const groupedMovies: MovieProps[][] = [];
  for (let i = 0; i < movies.length; i += itemsPerSlide) {
    groupedMovies.push(movies.slice(i, i + itemsPerSlide));
  }

  const settings = {
    arrows: true,
    infinite: groupedMovies.length > 1,
    autoplay: groupedMovies.length > 1,
    autoplaySpeed: 3000,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(getItemsPerSlide());
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

        <Carousel className="movie-carousel" {...settings}>
          {groupedMovies.map((movieGroup: MovieProps[], groupIndex: number) => (
            <div key={`movie-group-${groupIndex}`}>
              <ContentDiv itemCount={itemsPerSlide}>
                {movieGroup.map((movie: MovieProps) => (
                  <MovieItemPresenter
                    key={movie._id}
                    index={groupIndex === 0 ? movieGroup.indexOf(movie) : 1}
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
