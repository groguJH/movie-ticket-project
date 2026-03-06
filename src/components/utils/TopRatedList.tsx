// TopRatedPresenter.styles.ts
import styled from "@emotion/styled";

export const Wrapper = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px;
`;

export const Title = styled.h2`
  text-align: center;
  font-size: 24px;
  margin-bottom: 24px;
`;

export const Top5Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const MovieList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const MovieCard = styled.div<{ isSelected: boolean }>`
  background-color: ${({ isSelected }) => (isSelected ? "#222" : "#111")};
  color: white;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: ${({ isSelected }) =>
    isSelected ? "2px solid #1890ff" : "1px solid #333"};

  &:hover {
    background-color: #222;
  }

  h3 {
    font-size: 18px;
    margin: 1rem;
  }
`;

export const Overview = styled.p`
  font-size: 14px;
  color: #ccc;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; // 3줄 제한
  -webkit-box-orient: vertical;
`;

export const VideoWrapper = styled.div`
  flex: 1;
  background-color: #000;
  padding: 16px;
  border-radius: 8px;

  h4 {
    color: white;
    font-size: 18px;
    margin-bottom: 12px;
  }

  iframe {
    width: 100%;
    max-width: 100%;
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    iframe {
      height: 200px;
    }
  }
`;
