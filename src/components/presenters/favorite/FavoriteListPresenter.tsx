/** components/presenters/favorite/FavoritePageListPresenter.tsx */
import styled from "@emotion/styled";

interface Props {
  movieId: string;
  movieTitle: string;
  moviePost: string;
  movieRunTime: string;
  onClickFavorite: () => void;
}

const CardWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #fff;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Poster = styled.img`
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
`;

const Info = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: bold;
`;

const Runtime = styled.p`
  margin: 8px 0;
  color: #666;
`;

const RemoveButton = styled.button`
  padding: 6px 12px;
  font-size: 14px;
  background-color: #ff5c5c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #e94a4a;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export default function FavoriteListPresenter({
  movieId,
  movieTitle,
  moviePost,
  movieRunTime,
  onClickFavorite,
}: Props) {
  return (
    <CardWrapper key={movieId}>
      <Poster src={moviePost} alt={`${movieTitle} 영화포스터`} />
      <Info>
        <Title>{movieTitle}</Title>
        <Runtime>{movieRunTime}</Runtime>
        <RemoveButton onClick={onClickFavorite}>즐겨찾기 해제</RemoveButton>
      </Info>
    </CardWrapper>
  );
}
