import styled from "@emotion/styled";

export const Container = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const SeatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(7, 2fr);
  gap: 10px;
  margin: 16px 0;
`;

export const NoticeSection = styled.div`
  margin: 0px;
  margin-bottom: 32px;
  padding: 2rem;
  width: 100%;
`;

export const NoticeTitle = styled.h3`
  color: #ffffff;
  font-size: 20px;
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
`;

export const NoticeCard = styled.div`
  background-color: #2a2a2a;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  border-left: 4px solid #1890ff;
`;

export const NoticeSubtitle = styled.h4`
  color: #ffffff;
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 12px;
  font-weight: 600;
`;

export const NoticeList = styled.ul`
  color: #cccccc;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  padding-left: 16px;
  list-style: none;

  li {
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const MovieItem = styled.div`
  width: 100%;
  background-color: #1c1c1c;
  color: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #2c2c2c;
  }

  h3 {
    margin: 0 0 0.5rem 0;
  }

  p {
    font-size: 0.9rem;
    color: #ccc;
  }
`;

export const VideoWrapper = styled.div`
  margin-top: 1rem;
  iframe {
    border-radius: 8px;
  }
`;
