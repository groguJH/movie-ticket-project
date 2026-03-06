import { MovieBannerProps } from "../../../../types/fetchMovieBooking";
import {
  BannerImage,
  BannerWrapper,
  HeaderParagraph,
  Overlay,
} from "../../utils/MovieBannerLayout";

export default function MovieBanner({ movie, imageBaseUrl }: MovieBannerProps) {
  return (
    <>
      <BannerWrapper>
        <BannerImage
          src={`${imageBaseUrl}w1280${movie.backdrop_path}`}
          alt={movie.title}
        />
        <Overlay>
          <HeaderParagraph>
            <h3>{movie.title}</h3>
            <p>{movie.overview}</p>
          </HeaderParagraph>
        </Overlay>
      </BannerWrapper>
      <br />
    </>
  );
}
