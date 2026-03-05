import styled from "@emotion/styled";

import { Empty } from "antd";
import { FaRegFaceGrinBeamSweat } from "react-icons/fa6";

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  margin-top: 20px;
`;

const EmptyIcon = styled(FaRegFaceGrinBeamSweat)`
  font-size: 48px;
  margin-bottom: 20px;
  color: #bbb;
`;

const EmptyMessage = styled.p`
  font-size: 1.2rem;
  text-align: center;
`;

export default function EmptyFavoriteList() {
  return (
    <EmptyContainer>
      <EmptyIcon />
      <EmptyMessage>아직 즐겨찾기한 영화가 없습니다.</EmptyMessage>
      <Empty />
    </EmptyContainer>
  );
}
