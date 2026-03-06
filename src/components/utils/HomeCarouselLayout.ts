import styled from "@emotion/styled";
import { FloatButton } from "antd";

export const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;

  @media (max-width: 480px) {
    padding: 0 8px;
  }

  @media (min-width: 481px) and (max-width: 768px) {
    padding: 0 12px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 0 16px;
  }

  @media (min-width: 1025px) {
    max-width: 1200px;
    padding: 0 20px;
  }

  /* Slick 화살표 스타일 */
  .slick-arrow {
    width: 40px !important;
    height: 40px !important;
    z-index: 10 !important;

    &::before {
      font-size: 40px !important;
      color: rgba(255, 255, 255, 0.8) !important;
    }
    &::after {
      display: none !important;
      /* 불필요한 화살표 제거 */
    }
  }

  .slick-prev {
    left: -50px !important;

    @media (max-width: 768px) {
      left: -30px !important;
    }
  }

  .slick-next {
    right: -50px !important;

    @media (max-width: 768px) {
      right: -30px !important;
    }
  }

  /* ✨여기서부터 명시해주기위해 추가했습니다. */
  .movie-carousel {
    .slick-list {
      overflow: hidden !important;
      margin: 0 -10px; /* 아이템 간격 보정 */
    }

    .slick-track {
      display: flex !important;
      align-items: center !important;
    }

    .slick-slide {
      padding: 0 10px; /* 아이템 간격 */
      > div {
        height: 100%;
      }
    }
    /* ✨ MODIFIED: clone은 layout 유지하되, 화면에만 투명·숨김 처리 */
    .slick-cloned {
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
  }
`;

export const ContentStyle = styled.div`
  width: 100%;
  max-width: 100%;
  min-height: 450px;
  position: relative;
  padding: 0;
  color: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  overflow: visible;

  @media (max-width: 480px) {
    min-height: 350px;
  }

  @media (min-width: 481px) and (max-width: 768px) {
    min-height: 400px;
  }

  @media (min-width: 769px) {
    min-height: 450px;
  }
`;

export const ContentTitle = styled.div`
  position: relative;
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ec9f05, #ff4e00);
  margin-bottom: 20px;
  border-radius: 8px;

  span:first-of-type {
    font-size: 30px;
    font-weight: bold;
    color: white;

    @media (max-width: 480px) {
      font-size: 25px;
    }

    @media (min-width: 481px) and (max-width: 768px) {
      font-size: 23px;
    }

    @media (min-width: 769px) {
      font-size: 20px;
    }
  }
`;

export const MoreContentsLink = styled.span`
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-30%);
  margin-left: auto;
  font-size: 13px;
  font-weight: 500;
  color: #ffffffcc;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #fff;
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

export const ContentDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  width: 100%;
  height: 350px; /* 고정 높이 */
  box-sizing: border-box;
  gap: 15px;

  @media (max-width: 480px) {
    height: 280px;
    gap: 8px;
  }

  @media (min-width: 481px) and (max-width: 768px) {
    height: 320px;
    gap: 12px;
  }

  @media (min-width: 769px) {
    height: 350px;
    gap: 15px;
  }
`;

export const ContentItem = styled.div`
  position: relative;
  flex: 1;
  max-width: calc(25% - 11.25px); /* 4개 아이템을 위한 계산 */
  aspect-ratio: 2 / 3;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  @media (max-width: 480px) {
    max-width: calc(25% - 6px);
    border-radius: 8px;
  }

  @media (min-width: 481px) and (max-width: 768px) {
    max-width: calc(25% - 9px);
    border-radius: 10px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);

    img {
      transform: scale(1.05);
    }

    @media (max-width: 480px) {
      transform: translateY(-2px);
    }
  }
`;

export const HoverItem = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;

  ${ContentItem}:hover & {
    opacity: 1;
  }
`;

export const OverlayButton = styled.button`
  background-color: #ff4081;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  padding: 8px 16px;
  font-size: 12px;

  @media (min-width: 481px) {
    padding: 10px 20px;
    font-size: 13px;
  }

  @media (min-width: 769px) {
    padding: 12px 24px;
    font-size: 14px;
  }

  &:hover {
    background-color: #e73370;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(231, 51, 112, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const TitleOverlay = styled.span`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  color: white;
  text-align: center;
  z-index: 1;
  font-family: "Do Hyeon", "sans-serif" !important;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.7) 50%,
    transparent 100%
  );
  font-weight: 500;

  padding: 16px 8px 12px;
  font-size: 12px;
  line-height: 1.2;

  @media (min-width: 481px) {
    padding: 18px 10px 14px;
    font-size: 13px;
    line-height: 1.3;
  }

  @media (min-width: 769px) {
    padding: 20px 12px 16px;
    font-size: 14px;
    line-height: 1.4;
  }

  @media (min-width: 1025px) {
    font-size: 15px;
    line-height: 1.4;
  }
`;

// 사용하지 않는 컴포넌트들 (기존 코드 호환성을 위해 유지)
export const ContentAtom = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  border: 1px solid black;
  background: #ff69b4;
  padding: 0.5rem;

  @media (min-width: 481px) {
    padding: 0.75rem;
  }

  @media (min-width: 769px) {
    padding: 1rem;
  }
`;

export const FloatButtonStyled = styled(FloatButton)`
  &:hover {
    filter: brightness(0.85);
  }
`;

export const HoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  z-index: 2;
`;
