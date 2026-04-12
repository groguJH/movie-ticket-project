import styled from "@emotion/styled";

export const HeaderBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  transition:
    background-color 0.3s ease,
    opacity 0.3s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.3s ease;
  }

  &:hover {
    cursor: pointer;
  }
  @media (min-width: 1200px) {
    img {
      object-fit: cover;
    }
  }
`;

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
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 12px;

    h3 {
      font-size: 1.2rem;
    }

    p {
      font-size: 0.85rem;
    }
  }
`;

export const HeaderWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 500px;
  max-width: 1920px;
  flex-direction: column;
  justify-content: flex-end;
  margin: 0 auto;
  padding: 20px;
  z-index: 2;
  transition: background-color 0.3s ease;

  &:hover .header-background {
    background-color: rgba(28, 27, 27, 0.65);
    opacity: 0.6;
  }

  &:hover .header-paragraph h3,
  &:hover .header-paragraph p {
    transform: scale(1.05);
    opacity: 1;
  }

  @media (max-width: 768px) {
    height: 320px;
    padding: 12px;
  }
`;

export const ListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
    padding: 12px;
  }
`;

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

  @media (max-width: 768px) {
    h3 {
      font-size: 1rem;
    }

    p {
      font-size: 0.82rem;
    }
  }
`;

export const CardImage = styled.div<{ image: string }>`
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 720px;
  height: 439px;
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

  @media (max-width: 768px) {
    padding: 12px;

    h3 {
      font-size: 1rem;
    }

    p {
      font-size: 0.72rem;
    }
  }
`;
