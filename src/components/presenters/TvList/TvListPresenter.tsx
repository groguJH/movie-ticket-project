import Link from "next/link";
import { TvListPresenterProps } from "../../../../types/tvList";
import {
  CardImage,
  CardOverlay,
  HeaderBackground,
  HeaderWrapper,
  HeadParagraph,
  ListWrapper,
  MovieCard,
} from "../../utils/MovieListLayout";
import { InlineSmallSpinner } from "../../utils/loadingUI";

export default function TvListPresenter({
  TvImage,
  TvInfo,
  isFetching,
  imageBaseUrl,
}: TvListPresenterProps) {
  TvImage;

  return (
    <div>
      <HeaderWrapper>
        {TvImage && (
          <>
            <Link key={TvImage.id} href={`/TVbroadcast/${TvImage.id}`}>
              <HeaderBackground className="header-background">
                <img
                  src={`${imageBaseUrl}w1280${TvImage.backdrop_path}`}
                  alt={TvImage.name}
                />
              </HeaderBackground>
            </Link>
            <HeadParagraph className="header-paragraph">
              <h3>{TvImage.name}</h3>
              <p>{TvImage.overview}</p>
            </HeadParagraph>
          </>
        )}
      </HeaderWrapper>

      {/* TV 리스트 */}
      <ListWrapper>
        {TvInfo.filter((tv) => tv.overview).map((tv) => (
          <Link key={tv.id} href={`/TVbroadcast/${tv.id}`}>
            <MovieCard>
              <CardImage image={`${imageBaseUrl}w780${tv.backdrop_path}`}>
                <CardOverlay className="overlay">
                  <h3>{tv.name}</h3>
                  <p>{tv.overview}</p>
                </CardOverlay>
              </CardImage>
            </MovieCard>
          </Link>
        ))}
      </ListWrapper>

      {/* 하단 로딩 표시 */}
      {isFetching && <InlineSmallSpinner />}
    </div>
  );
}
