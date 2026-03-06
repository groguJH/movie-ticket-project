import styled from "@emotion/styled";

export const BannerWrapper = styled.div`
  width: 100%;
  max-height: 500px;
  overflow: hidden;
  position: relative;
  margin-bottom: 1rem;
`;

export const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

export const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  color: #fff;
  padding: 1rem;
`;

export const HeaderParagraph = styled.div`
  text-align: start;
  max-width: 80%;
  margin: 0;
  padding: 2rem;

  h3 {
    margin-bottom: 0.6rem;
  }

  p {
    margin-top: 0.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* 최대 3줄 */
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
  }
`;
