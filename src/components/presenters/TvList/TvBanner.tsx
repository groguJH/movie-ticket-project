import { TvBannerProps } from "../../../../types/fetchTvList";
import {
  BannerImage,
  BannerWrapper,
  HeaderParagraph,
  Overlay,
} from "../../utils/MovieBannerLayout";

export default function TvBanner({ tv, imageBaseUrl }: TvBannerProps) {
  return (
    <>
      <BannerWrapper>
        <BannerImage
          src={`${imageBaseUrl}w1280${tv.backdrop_path}`}
          alt={tv.name}
        />
        <Overlay>
          <HeaderParagraph>
            <h3>{tv.name}</h3>
            <p>{tv.overview}</p>
          </HeaderParagraph>
        </Overlay>
      </BannerWrapper>
      <br />
    </>
  );
}
