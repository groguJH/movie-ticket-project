import styled from "@emotion/styled";

export const FavoriteItem = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
  padding: 16px 0;
  &:last-child {
    border-bottom: none;
  }
`;

export const MoviePoster = styled.div`
  width: 80px;
  height: 120px;
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  margin-right: 16px;
`;

export const MovieInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const MovieTitle = styled.h4`
  margin: 0 0 8px;
  font-size: 16px;
  color: #111 !important;
`;

export const MovieRunTime = styled.div`
  font-size: 13px;
  color: #444;
  margin-bottom: 12px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
`;

export const Button = styled.button`
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  border: none;

  &.booking {
    background: #1a1a2e;
    color: white;
  }

  &.remove {
    background: #f0f0f0;
    color: #333;
  }
`;
