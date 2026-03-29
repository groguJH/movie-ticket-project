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

  @media (max-width: 768px) {
    padding: 28px 12px;
  }
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

  > div {
    flex: 0 0 580px;
    max-width: 580px;
    min-width: 0;

    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  @media (max-width: 1199px) and (min-width: 901px) {
    justify-content: center;

    > div {
      flex: 1 1 48%;
      max-width: 48%;
      transform: translateY(0);
    }
  }

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;

    > div {
      flex: 0 0 auto;
      width: 100%;
      max-width: 580px;
      transform: translateY(15px);
    }
  }
`;

export const Title = styled.h2`
  margin: 0 0 48px 0;
  font-weight: 700;
  color: #ffffff;
  align-items: center;

  @media (max-width: 768px) {
    margin-bottom: 28px;
    font-size: 1.35rem;
    text-align: center;
  }
`;

export const SectionText = styled.span`
  font-size: 14px;
  color: #a9a9a9;
`;

export const Text = styled.p`
  color: white;
`;

export const StatCard = styled.div`
  min-height: 260px;
  border-radius: 16px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);

  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;

  @media (max-width: 768px) {
    min-height: 220px;
    height: auto;
    padding: 18px;
  }
`;

export const StatCardHeader = styled.div`
  font-weight: 700;
  color: #fff;
  font-size: 16px;
`;

export const StatCardBody = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 12px;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 16px 0 0;
  }
`;

export const WrapperContent = styled.div`
  width: 100%;
  height: 430px;
  display: flex;
  flex-direction: row;
  gap: 20px;

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

  .list-section {
    width: 100%;
  }

  .detail-section {
    display: none;
  }

  @media (max-width: 900px) {
    height: auto;
    flex-direction: column;

    &.has-selection {
      .list-section,
      .detail-section {
        width: 100%;
      }
    }
  }
`;

export const ListWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 5px;

  @media (max-width: 768px) {
    padding: 16px 0;
  }
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

  &.selected {
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

  &:hover {
    border: 1px solid #0070f3;
  }

  &:focus {
    outline: 2px solid #0070f3;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
`;

export const HeaderMain = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    gap: 6px;
  }
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

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

export const Direction = styled.span`
  font-size: 12px;
  margin-left: 12px;
`;

export const DetailSection = styled.div`
  height: 100%;
  background: #282828;
  padding: 20px;
  border-radius: 12px;

  display: flex;
  flex-direction: column;

  box-shadow: -7px -7px 15px rgba(255, 255, 255, 0.05),
    7px 7px 15px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    padding: 16px;
  }
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

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 12px;
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
  flex-wrap: wrap;
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

  @media (max-width: 768px) {
    padding: 5px 0;
    height: auto;
    max-height: 60vh;
  }
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

  @media (max-width: 768px) {
    width: 100%;
    flex-wrap: wrap;
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
      return "#ffc107";
    case "처리 중":
      return "#0070f3";
    case "완료":
      return "#28a745";
    default:
      return "#6c757d";
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
  padding: 12px;
`;

export const ModalBox = styled.div`
  width: min(900px, calc(100vw - 24px));
  max-height: 80vh;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
`;

export const StatLabel = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin-top: 12px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
`;

export const StatValueText = styled.span`
  font-size: 14px;
  color: #ffffff;
  margin-right: 8px;
  min-width: 60px;
  display: inline-block;
`;

export const SearchRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 24px;

  input {
    width: 100%;
    max-width: 1000px;
  }

  @media (max-width: 768px) {
    margin: 16px 0;
  }
`;
