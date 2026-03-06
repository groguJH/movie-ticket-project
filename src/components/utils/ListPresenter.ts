import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const FadeIn = keyframes`
  from {
    opacity: 0;   
  }
  to {
    opacity: 1;
    transition: all 0.3s ease-in-out;

  }
`;

export const Wrapper = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 0;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const WrapperSection = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-around;
  gap: 20px;
  align-items: flex-start;
  padding: 20px 8px;
  box-sizing: border-box;
  margin: 0 auto 40px;

  /* 기본(데스크탑) : 각 카드 고정폭으로 정확하게 맞추기 */
  > div {
    flex: 0 0 580px; /* 카드 고정폭(데스크탑) */
    max-width: 580px;
    min-width: 0;

    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  /* 중간 브레이크포인트 (태블릿/좁은 데스크탑)
     - 부모가 1200보다 작아지면 두 카드를 비율로 줄여서 같이 들어가게 함.
     - 48% 정도로 두 개를 배치(간격 포함). */
  @media (max-width: 1199px) and (min-width: 901px) {
    justify-content: center;

    > div {
      flex: 1 1 48%; /* 유연하게 줄어들고 늘어남 */
      max-width: 48%;
      transform: translateY(0);
    }
  }

  /* 모바일: 폭이 좁으면 세로로 쌓기 */
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center; /* 각 카드 가운데 정렬 */

    > div {
      flex: 0 0 auto;
      width: 100%;
      max-width: 580px; /* 카드가 지나치게 넓지 않게 제한 (선택사항) */
      transform: translateY(15px);
    }
  }
`;

export const Title = styled.h2`
  margin: 0 0 48px 0;
  font-weight: 700;
  color: #ffffff;
  align-items: center;
`;

export const SectionText = styled.span`
  font-size: 14px;
  color: #a9a9a9;
`;

export const Text = styled.p`
  color: white;
`;

export const StatCard = styled.div`
  /* width: 560px; */
  height: 260px;
  border-radius: 16px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);

  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: stretch; /* ✅ 수정: 카드가 항상 부모 너비 꽉 채우도록 */
  overflow: hidden; /* ✅ 수정: 내부 요소가 튀어나오지 않게 */
`;

/* 카드 헤더(작은 제목) */
export const StatCardHeader = styled.div`
  font-weight: 700;
  color: #fff;
  font-size: 16px;
`;

/* 카드 본문 */
export const StatCardBody = styled.div`
  width: 100%;
  height: 100%; /* ✅ 카드 높이 안에서만 */
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 12px;
  overflow: hidden;
`;

export const WrapperContent = styled.div`
  width: 100%;
  height: 430px;
  display: flex;
  flex-direction: row;
  gap: 20px;

  /* 말줄임표 */
  /* overflow: hidden;
  text-overflow: ellipsis; */

  /* 선택된 항목이 있을 때 적용될 스타일 */
  &.has-selection {
    .list-section {
      width: 50%;
    }

    .detail-section {
      width: 50%;
      display: block;
      animation: ${FadeIn} 0.4s ease-in-out;
    }
  }

  /* 선택된 항목이 없을 때 */
  .list-section {
    width: 100%;
  }

  .detail-section {
    display: none;
  }
`;

export const ListWrapper = styled.div`
  width: 100%;
  max-width: 1200px; /* ✅ 추가 */
  margin: 0 auto; /* ✅ 가운데 정렬 */
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 5px;
`;

export const List = styled.ul`
  display: inline-block;
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const Item = styled.li`
  display: block;
  /* border-bottom: 1px solid #eee; */

  /* 선택된 항목 스타일 */
  &.selected {
    /* background-color: #fafafa; */
  }
`;

export const HeaderButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;

  /* 리스트 호버시 색상 인식을 할 수 있습니다.  */
  &:hover {
    /* background-color: #f9f9f9; */
    border: 1px solid #0070f3;
  }

  &:focus {
    outline: 2px solid #0070f3;
    border-radius: 4px;
  }
`;

export const HeaderMain = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
`;

export const TitleText = styled.span`
  font-weight: 600;
  color: white;
`;
export const MetaInfo = styled.div`
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #a9a9a9;
`;

// 화살표
export const Direction = styled.span`
  font-size: 12px;
  margin-left: 12px;
`;

// 우측에 표시될 상세 영역
export const DetailSection = styled.div`
  height: 100%;
  background: #282828;
  padding: 20px;
  border-radius: 12px;

  display: flex;
  flex-direction: column;

  box-shadow: -7px -7px 15px rgba(255, 255, 255, 0.05),
    7px 7px 15px rgba(0, 0, 0, 0.3);
`;

export const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #ddd;

  input {
    background-color: #4a4a4a;
    width: 100%;
    height: 100%;
    margin-right: 10px;
    padding: 10px;
    border: none;
    outline: none;
    border-radius: 4px;
    font-size: 18px;
    color: #d3d3d3;
  }
`;

export const DetailTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #fafafa;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const EditButton = styled.button`
  width: 90px;
  padding: 8px 16px;
  background: #0070f3;
  color: #f6f1f1;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;

  &:hover {
    background: #0051cc;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
  }
  &:active {
    text-shadow: none;
    box-shadow: 0 0 #0051cc;
    background: #003399;
  }
`;

export const CloseButton = styled.button`
  width: 32px;
  padding: 0;
  margin: 0;
  background: #0070f3;
  color: #f6f1f1;
  border: 0;
  border-radius: 4px;
  font-size: 20px;
  cursor: pointer;

  span {
    line-height: 1;
  }
  &:hover {
    background: #0051cc;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
  }
  &:active {
    text-shadow: none;
    box-shadow: 0 0 #0051cc;
    background: #003399;
  }
`;

export const DetailContent = styled.div`
  padding: 5px 18px;
  flex-grow: 1;
  height: 550px;
  overflow-y: scroll;
`;

export const DetailItem = styled.div`
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.6;
  border: none;

  strong {
    display: block;
    margin-bottom: 4px;
    color: #f5f5f5;
    font-weight: 600;
  }

  span {
    color: #d3d3d3;
    padding-left: 8px;
  }

  textarea {
    width: 100%;
    padding: 8px;
    outline: none;
    resize: none;
    background-color: #4a4a4a;
    color: #d3d3d3;
  }
`;

export const MainWrapper = styled.div`
  background: #fafafa;
`;

export const MainContent = styled.div`
  padding: 12px;
`;

export const ContentText = styled.div`
  width: 100%;
  border-radius: 4px;
  line-height: 1.8;
  color: #d3d3d3;
  word-wrap: break-word;
  padding-left: 8px;
  padding-bottom: 8px;
`;

export const Pagination = styled.nav`
  display: flex;
  gap: 6px;
  margin-top: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const PageButton = styled.button`
  padding: 6px 10px;
  background: none;
  cursor: pointer;
  color: #d3d3d3;

  &:disabled {
    color: #0070f3;
    cursor: pointer;
    box-shadow: none;
  }

  &:not(:disabled):hover {
    box-shadow: inset 0 0 0 100px rgba(255, 255, 255, 0.1);
  }
  &:focus {
    color: #d3d3d3;
    outline: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 4px;
  }
`;

// 피드백 관리자페이지에서 사용될 컴포넌트입니다.
export const WriterInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #a9a9a9;
  span {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
  }
`;

export const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: #1c1c1c;
  background-color: ${(props) => getStatusColor(props.status)};
  margin-left: 8px;
`;
const getStatusColor = (status: string) => {
  switch (status) {
    case "대기":
      return "#ffc107"; // 노란색
    case "처리 중":
      return "#0070f3"; // 파란색
    case "완료":
      return "#28a745"; // 초록색
    default:
      return "#6c757d"; // 회색
  }
};

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1200;
`;

export const ModalBox = styled.div`
  width: 900px;
  max-height: 80vh;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
`;

// 통계
export const StatLabel = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff; /* 순백색으로 변경하여 가독성 확보 */
  margin-top: 12px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
`;

export const StatValueText = styled.span`
  font-size: 14px;
  color: #ffffff; /* MetaInfo와 유사한 회색 */
  margin-right: 8px;
  min-width: 60px;
  display: inline-block;
`;

/* 검색어 창 */
export const SearchRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 24px;

  input {
    width: 100%;
    max-width: 1000px;
  }
`;
