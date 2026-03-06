import styled from "@emotion/styled";

/* HeaderBackground: 기본 이미지와 transition 효과 */
export const HeaderBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  transition: background-color 0.3s ease, opacity 0.3s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    cursor: pointer;
  }
`;

/* HeadParagraph: 내부 텍스트에 transition 추가 */
export const HeadParagraph = styled.div`
  position: relative;
  color: white;
  padding: 16px;
  border-radius: 8px;
  max-width: 60%;
  z-index: 1;

  h3 {
    opacity: 0;
    transition: transform 0.2s ease;
    margin: 0;
  }

  p {
    opacity: 0;
    font-size: 0.9rem;
    transition: transform 0.2s ease;
    /* 텍스트 가리기에 필수 */
    display: -webkit-box;
    -webkit-line-clamp: 3; /* 최대 3줄 */
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
  }
`;

/* HeaderWrapper: hover 시 .header-background와 .header-paragraph 내부 텍스트의 스타일을 변경 */
export const HeaderWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 500px;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  z-index: 2;
  transition: background-color 0.3s ease;

  /* hover 시 .header-background에 회색 오버레이 효과 */
  &:hover .header-background {
    background-color: rgba(28, 27, 27, 0.65);
    opacity: 0.6;
  }

  /* hover 시 .header-paragraph 내부의 h3, p 확대 */
  &:hover .header-paragraph h3,
  &:hover .header-paragraph p {
    transform: scale(1.05);
    opacity: 1;
  }
`;

/* ListWrapper: 영화 카드 리스트 레이아웃 */
export const ListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 20px;
`;

/* MovieCard: 영화 카드 스타일 */
export const MovieCard = styled.div`
  max-height: 500px;
  border-radius: 12px;
  text-align: center;

  h3 {
    margin-top: 8px;
    font-size: 1.2rem;
    color: black;
  }

  p {
    font-size: 0.9rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: black;
  }
`;

/* CardImage: 영화 카드의 이미지 스타일 */
export const CardImage = styled.div<{ image: string }>`
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  object-fit: contain;

  &:hover .overlay {
    opacity: 1;
    cursor: pointer;
  }
`;

/* CardOverlay: 영화 카드 이미지 오버레이 스타일 */
export const CardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(28, 27, 27, 0.65);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px;
  object-fit: contain;

  h3 {
    margin: 0 0 8px;
    font-size: 1.2rem;
    color: white;
  }

  p {
    font-size: 0.7rem;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    color: white;
  }
`;
