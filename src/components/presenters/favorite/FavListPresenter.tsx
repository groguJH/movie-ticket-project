import Link from "next/link";
import {
  Button,
  ButtonGroup,
  FavoriteItem,
  MovieInfo,
  MoviePoster,
  MovieRunTime,
  MovieTitle,
} from "../../utils/MypageFavLayout";
import { Card, Cards, Container } from "../../utils/MyPageLayout";
import { FavListItemPresenterProps } from "../../../../types/favoriteButton";
import { ListSkeleton } from "../../utils/loadingUI";

export default function FavListPresenter({
  movieId,
  movieTitle,
  bookingId,
  moviePost,
  movieRunTime,
  onClickFavorite,
  onClickDelete,
  mediaType,
  isLoading,
}: FavListItemPresenterProps) {
  if (isLoading) {
    return (
      <>
        <ListSkeleton />
      </>
    );
  }

  return (
    <Cards>
      <Card>
        <FavoriteItem>
          <MoviePoster style={{ backgroundImage: `url(${moviePost})` }} />
          <MovieInfo>
            <MovieTitle>{movieTitle}</MovieTitle>
            <MovieRunTime>{movieRunTime}분</MovieRunTime>

            <ButtonGroup>
              {mediaType === "movie" ? (
                <Button className="booking" onClick={onClickFavorite}>
                  예매하기
                </Button>
              ) : (
                <Link href={`/TVbroadcast/${movieId}`}>
                  <Button className="booking">상세보기</Button>
                </Link>
              )}

              <Button className="remove" onClick={onClickDelete}>
                즐겨찾기 해제
              </Button>
            </ButtonGroup>
          </MovieInfo>
        </FavoriteItem>
      </Card>
    </Cards>
  );
}
